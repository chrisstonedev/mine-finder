window.addEventListener('DOMContentLoaded', () => {
  const replaceText = (selector: string, text: string | undefined) => {
    const element = document.getElementById(selector);
    if (element && text !== undefined) element.innerText = text;
  };

  for (const type of ['chrome', 'node', 'electroon']) {
    replaceText(`${type}-version`, process.versions[type]);
  }
});
