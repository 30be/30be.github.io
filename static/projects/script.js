function main() {
  const programming = document.getElementById("programming");
  const sleep = document.getElementById("sleep");
  const socialization = document.getElementById("socialization");
  // Better would be to get all checkboxes in one array(getElementsByTagName)
  const all = [programming, sleep, socialization];
  sleep.checked = true;
  programming.checked = true;

  sleep.onchange =
    socialization.onchange =
    programming.onchange =
      (e) => {
        const checkedNumber = all.filter((x) => x.checked).length;
        if (checkedNumber > 2)
          for (const x of all)
            if (x !== e.target) {
              x.checked = false;
              return;
            }
      };
}
window.onload = main;
