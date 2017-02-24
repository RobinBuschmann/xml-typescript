
export const DEFAULT_ATTRIBUTE_PROPERTY = '@';

export function ns(namepsace: string, value: string): string {

  return namepsace + ':' + value;
}

export function createCustomGetter(_options: {restrictTo?: any[], getter?: (entity: any) => any, value?: any}): (entity: any) => any {
  if (_options.restrictTo) {
    const restrictTo = _options.restrictTo as any[];
    return entity => {
      if (restrictTo.indexOf(entity) !== -1) {
        return (_options.getter ? _options.getter(entity) : _options.value);
      }
    };
  }
  return (_options.getter || (() => _options.value));
}
