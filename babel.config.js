module.exports = function (api) {
  api.cache(true);

  return {
    presets: ['babel-preset-expo'],
    // Maskito's source (consumed raw from the git submodule) has class fields that
    // read constructor *parameter properties* in their initializers, e.g.
    //   class Maskito { private isTextArea = this.element.nodeName === 'TEXTAREA';
    //                   constructor(public readonly element) {} }
    // This only works under `useDefineForClassFields: false` semantics, which is how
    // maskito's own published build is compiled. Hermes/Metro otherwise keep class
    // fields native, so the field initializer runs before `this.element` is assigned
    // and crashes with "Cannot read properties of undefined (reading 'nodeName')".
    // Forcing the (loose) class-properties transform lowers fields into the
    // constructor body *after* the parameter properties, restoring the expected order.
    //
    // Scoped to the submodule so we don't rewrite React Native / third-party classes
    // (a global transform breaks e.g. `Event.NONE` and forces the private-* plugins).
    // The `test` MUST be a function, not a string/RegExp: Metro builds its transform
    // cache key by loading this config with NO filename, and Babel throws on a
    // string/RegExp pattern in that case — but it simply calls a function pattern with
    // `undefined` (returns false here), so the bundler keeps working.
    overrides: [
      {
        test: (filename) => !!filename && filename.includes('submodules/maskito'),
        plugins: [['@babel/plugin-transform-class-properties', {loose: true}]],
      },
    ],
  };
};
