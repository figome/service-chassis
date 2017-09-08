/*
[
  [
      '', 'm', '_', '_J', 'u', 'ju-', '-', 'found', '__ENDE__',
      '__ENDE__', '_', '_J', 'u', 'ju-', '-', 'found2', '__ENDE__'
  ],
  ['m__Juju--found__ENDE____ENDE____Juju--found2__ENDE__']
].forEach( elements => {

  const initialScanner = new StreamScanner('__Juju--');
  const endScanner = new StreamScanner('__ENDE__');

  let payload: string[] = [];
  let currentScanner = initialScanner;

  elements.forEach(fragment => {
      currentScanner.feed(elements.join(''), 0, function found(f, ofs): void {

          if (currentScanner === initialScanner) {
              endScanner.feed(fragment, ofs, found);
              currentScanner = endScanner;
              payload = [ fragment.substr(ofs) ];
          } else if (currentScanner === endScanner) {
              payload.push(fragment.substr(0, ofs - currentScanner.hayStack.length));
              initialScanner.feed(fragment, ofs, found);
              currentScanner = initialScanner;
              console.log('PAYLAOD:', payload.join(''), '\n');

          }

      });

      if (currentScanner === endScanner) {
          payload.push(fragment);
      }

  });
});
*/
