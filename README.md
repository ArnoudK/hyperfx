# hyperfx (WORK IN PROGRESS)

HyperFX makes manipulating DOM elements easier.

Most of HyperFX is a wrapper around creating DOM elements is TypeScript/JavaScript. Unlike the default that's provided by MDN wrappers HyperFX tries to extend it with more type safety (luckely html5 standard are quite forgiving).

## Get started

```bash
pnpm create vite my-vue-app --template vanilla-ts
pnpm add hyperfx
```

### Example code:

_index.html_

```html
<!doctype html>
<html lang="en">
	<head>
		<script type="module" src="/src/main.ts" defer async></script>
		<style>
			.red {
				color: red;
				font-size: 1.2rem;
				padding: 0.5rem;
				font-weight: bolder;
				border: 0.15rem solid red;
				border-radius: 0.5rem;
			}
		</style>
	</head>
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
pnpm dev
```

And it should look like this in the browser:

<html>
    <body>
    <style>
        .red {
            color: red;
            font-size: 1.2rem;
			padding: 0.5rem;
            font-weight: bolder;
            border: 0.15rem solid red;
            border-radius: 0.5rem;
        }
    </style>
                <div id="deez">
                	<p class="red">This is a red paragraph!</p>
                </div>
    </body>
</html>

### Example project

Inside the 'example_project' directory is an example project using tailwind with vite. This project shows basic usage with routing.
