-- SPDX-License-Identifier: MIT
--  See LICENSE for details.

import Data.Aeson
import Data.Text (pack, stripSuffix, unpack)
import Hakyll
import Text.Blaze.Html.Renderer.String (renderHtml)
import Text.Blaze.Html5 as H hiding (main)
import Text.Blaze.Html5.Attributes as A

data PostData = PostData
  { postTitle :: String,
    postDate :: String,
    postRoute :: String,
    postContent :: String
  }
  deriving (Generic, ToJSON)

googleAnalyticsScript :: Html
googleAnalyticsScript = do
  let gaMeasurementId = "G-8Z3SYE9BYY" :: Text
  script ! async "async" ! src ("https://www.googletagmanager.com/gtag/js?id=" <> toValue gaMeasurementId) $ mempty
  (script . toHtml . unlines)
    [ "window.dataLayer = window.dataLayer || [];",
      "function gtag(){dataLayer.push(arguments);}",
      "gtag('js', new Date());",
      "gtag('config', '" <> gaMeasurementId <> "');"
    ]

getPostData :: Item a -> Compiler PostData
getPostData =
  itemIdentifier >>> \postID ->
    PostData
      <$> getMetadataField' postID "title"
      <*> getMetadataField' postID "date"
      <*> (fromMaybe (fail $ "Route not found for " <> show postID) <$> getRoute postID)
      <*> loadBody postID

jsonIndexCompiler :: [Item String] -> Compiler (Item String)
jsonIndexCompiler = traverse getPostData >=> encode >>> decodeUtf8 >>> makeItem

indexCompiler :: [Item String] -> Item String -> Compiler (Item String)
indexCompiler posts text = fmap . renderText <$> traverse getPostData posts ?? text
  where
    strip url = toValue $ stripSuffix ".html" url ?: url
    renderText postsData text = renderHtml $ do
      preEscapedToHtml text
      ul $ forM_ postsData $ \(PostData {..}) ->
        li $ a ! href (strip $ toText postRoute) $ toHtml $ postTitle <> " - " <> postDate

telegramComments :: String -> Html
telegramComments id = do
  script
    ! async ""
    ! src "https://telegram.org/js/telegram-widget.js?22"
    ! dataAttribute "telegram-discussion" (toValue $ "shoggothstaring/" <> id)
    ! dataAttribute "comments-limit" "20"
    ! dataAttribute "color" "EB99A1"
    ! dataAttribute "dark" "1"
    $ mempty

defaultTemplate :: Item String -> Compiler (Item String)
defaultTemplate item = do
  url <- mappend "https://shoggothstaring.com/" . unpack . maybeToMonoid . stripSuffix ".html" . pack . maybeToMonoid <$> getRoute iid
  title <- maybeToMonoid <$> getMetadataField iid "title"
  desc <- maybeToMonoid <$> getMetadataField iid "description"
  relativizeUrls $ renderHtml . defaultHTML url title desc . preEscapedToHtml <$> item
  where
    iid = itemIdentifier item
    headerLinks = [("/", "Home"), ("/about", "About"), ("/me", "Me"), ("/rss.xml", "RSS")]
    defaultHTML :: String -> String -> String -> Html -> Html
    defaultHTML url title desc contents = docTypeHtml ! lang "en" $ do
      let fullTitle = "shoggothStaring" <> (if null title then "" else " :: ") <> title
      H.head $ do
        H.title $ toHtml fullTitle
        meta ! charset "utf-8"
        meta ! httpEquiv "x-ua-compatible" ! content "ie=edge"
        meta ! name "viewport" ! content "width=device-width, initial-scale=1"
        meta ! name "color-scheme" ! content "light dark"
        link ! rel "stylesheet" ! href "https://cdn.jsdelivr.net/npm/sakura.css/css/sakura.css" ! media "screen"
        link ! rel "stylesheet" ! href "https://cdn.jsdelivr.net/npm/sakura.css/css/sakura-vader.css" ! media "screen and (prefers-color-scheme: dark)"
        link ! rel "stylesheet" ! href "pandoc-pygments.css" ! media "screen and not (prefers-color-scheme: dark)"
        link ! rel "stylesheet" ! href "pandoc-zenburn.css" ! media "screen and (prefers-color-scheme: dark)"
        link ! rel "stylesheet" ! href "style.css"
        link ! rel "canonical" ! href (toValue url) -- Required for telegram comments
        meta ! property "og:site_name" ! content "shoggothStaring"
        meta ! property "og:title" ! content (toValue fullTitle)
        meta ! property "og:url" ! content (toValue url)
        if null desc then mempty else meta ! property "og:description" ! content (toValue desc)
        meta ! property "og:type" ! content "article"
        script ! async "async" ! src "search.js" $ mempty
        googleAnalyticsScript
      body $ do
        nav $ do
          forM_ headerLinks $ \(link, label) -> a ! href link $ label
          input ! type_ "text" ! A.id "search-input" ! placeholder "Search"

        H.div ! A.id "search-results" $ mempty
        article ! class_ "user-content" $ contents
        footer $ do
          hr
          p $ do
            "© 2025 LS4. The page source and code are available on "
            a ! href "https://github.com/30be/30be.github.io" $ "GitHub"
            "."

postTemplate :: Item String -> Compiler (Item String)
postTemplate item = do
  [title, date] <- fmap toHtml <$> forM ["title", "date"] (getMetadataField' (itemIdentifier item))
  telegramId <- getMetadataField (itemIdentifier item) "telegram_id"

  let postHTML contents = do
        h1 title
        small date
        void contents
        maybe mempty telegramComments telegramId
  pure $ renderHtml . postHTML . preEscapedToHtml <$> item

config :: Configuration
config = defaultConfiguration {destinationDirectory = "docs"}

main :: IO ()
main = hakyllWith config $ do
  match "static/**" $ route (gsubRoute "static/" (const "")) >> compile copyFileCompiler
  match "posts/index.md" $ do
    route $ gsubRoute "posts/" (const "") `composeRoutes` setExtension "html"
    compile $ do
      posts <- recentFirst =<< loadAll (fromVersion Nothing .&&. posts)
      pandocCompiler >>= indexCompiler posts >>= defaultTemplate
  match "posts/*" $ version "raw" $ do
    route $ gsubRoute "posts/" (const "")
    compile getResourceString
  match "posts/*" $ do
    route $ gsubRoute "posts/" (const "") `composeRoutes` setExtension "html"
    compile $ pandocCompiler >>= postTemplate >>= saveSnapshot "content" >>= defaultTemplate

  create ["search.json"] $ do
    route idRoute
    compile $ loadAll (fromVersion (Just "raw") .&&. "posts/*") >>= jsonIndexCompiler

  makeFeed renderRss ["feed.rss", "rss.xml", "feed"]
  makeFeed renderAtom ["atom.xml", "feed.atom"]

posts :: Pattern
posts = "posts/*" .&&. complement (Hakyll.fromList ["posts/404.md", "posts/index.md", "posts/about.md", "posts/me.md"])

makeFeed :: (FeedConfiguration -> Context String -> [Item String] -> Compiler (Item String)) -> [Identifier] -> Rules ()
makeFeed render targets =
  create targets $ do
    route idRoute
    compile $
      loadAllSnapshots (fromVersion Nothing .&&. posts) "content"
        >>= fmap (take 10) . recentFirst
        >>= render configuration (defaultContext <> bodyField "description")
  where
    configuration =
      FeedConfiguration
        { feedTitle = "shoggothStaring",
          feedDescription = "Thoughts about now and future, written mostly for myself.",
          feedAuthorName = "LS4",
          feedAuthorEmail = "lykd@pm.me",
          feedRoot = "https://shoggothstaring.com"
        }
