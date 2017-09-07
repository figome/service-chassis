
interface Hexle {
  findCount: number;
  payload: string[];
  hexle: string[][];
}
function hexler(ret: Map<string, Hexle>, count: number, payload: string[], hayStack: string): void {
  const hexle: Hexle = { findCount: count, payload: payload, hexle: [ [hayStack] ] };
  [1, 2, 3, 4, 5, 6, 7, 8, 9].forEach(fragLen => {
    const tmp: string[] = [];
    for (let i = 0; i < hayStack.length; i += fragLen) {
      tmp.push(hayStack.substr(i, fragLen));
    }
    hexle.hexle.push(tmp);
  });
  ret.set(hayStack, hexle);
}

export function fragentize(): Map<string, Hexle> {
  const ret = new Map<string, Hexle>();
  hexler(ret, 0, [], '');
  hexler(ret, 2, [], '__Juju--found____Juju--');
  hexler(ret, 0, [], '__Juju-+');
  hexler(ret, 1, [], 'm__Juju--found');
  hexler(ret, 0, [], 'm__Juju-+meno');
  hexler(ret, 2, [], 'meno__Juju--__Juju--found');
  hexler(ret, 0, [], 'meno__Juju-+meno');

  hexler(ret, 0, [], 'meno__Juju-+meno');
  hexler(ret, 0, ['', ''], 'meno__BEGIN--_-END-_meno_-__BEGIN--_-END-_bla');
  hexler(ret, 0, ['found', 'found2'], 'meno__BEGIN--found_-END-_meno_-__BEGIN--found2_-END-_bla');
  hexler(ret, 0, ['found'], 'meno__BEGIN--found_-END-_meno_-__BEGIN--found_-XEND-_bla');
  return ret;
}
