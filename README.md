# hyperfx (WORK IN PROGRESS)

HyperFX makes manipulating DOM elements easier.

Most of HyperFX is a wrapper around creating DOM elements is TypeScript/JavaScript. Unlike the default that's provided by MDN wrappers HyperFX tries to extend it with more type safety (luckely html5 standard are quite forgiving).

## Get started

```bash
yarn create vite my-vue-app --template vanilla-ts
yarn add hyperfx
```

### Example code:

_index.html_

```html
<!DOCTYPE html>
<html>
<head>
<script type="module" src="/src/main.ts" defer="defer"></script>
<style>
.red {
color: red;
font-size: 1.2rem;
font-weight: bolder;
border: 2px solid red;
border-radius: 5px;
}
</style>
<head/>
<body>
<div id="deez"></div>
</body>
</html>
```

_src/main.ts_

```ts
import { P, t } from 'hyperfx';
const myDiv = document.getElementById('deez')!;
const newP = P({ class: 'red' }, [t('This is a red paragraph')]);
myDiv.appendChild(newP);
```

You can run it with

```sh
yarn dev
```

And it should look like this in the browser:

<html>
    <body>
    <style>
        .red {
            color: red;
            font-size: 1.2rem;
            font-weight: bolder;
            border: 2px solid red;
            border-radius: 5px;
        }
    </style>
                <div id="deez">
                <p class="red">This is a red paragraph!</p>
                </div>
    </body>
</html>
