---
sidebar_position: 2
---

# Generators

## Overview

Create new generator:

```bash
$ hygen generator new --name mailer
                              `-------- just a name you pick.
```

It will create a corresponing template for us:

```bash
Loaded templates: _templates
       added: _templates/mailer/new/hello.ejs.t
                                       `------ your template file.
```

If we don't specify a generator, it's will throw error and available generator list. As you can see below, `mailer` has been added.

```bash
$ hygen

Error: please specify a generator.

Available actions:
generator: new, with-prompt
mailer: new
    \
     `----------- your new generator is already here!
```

When a generator under `\templates`, it's ready to use.

Here's hello.ejs.t that was placed in the template folder for you:

```ejs title="_templates/mailer/new/hello.ejs.t"
---
to: app/hello.js
---
const hello = `
Hello!
This is your first hygen template.

Learn what it can do here:

https://github.com/jondot/hygen
`

console.log(hello)
```

:::info

**hygen** doesn't care about file names or file types in your generator folders. It only cares about folder structure and the contents of your files.

:::

## Structure

```markup
.
├── _templates/
│   └── mailer/
│       └── new/
│           ├── html.ejs.t
│           └── text.ejs.t
├── app/
│   └── index.js
└── package.json
```

Every time you call it, `hygen mailer new` automagically picks up the closest `_templates` folder, and renders all files in `mailer/new`. In this case it's `html.ejs.t` and `text.ejs.t`.

## CLI Arguments

```bash
$ hygen mailer new --name foobar --message hello --version 1
```

Any double-dash (`--`) argument becomes a variable we can use later in our templates.

Here's the contents of the template `html.ejs.t` with the variables in place:

```ejs
---
to: app/emails/<%= name %>.html
---
<h1>Hello <%= name %></h1>
<%= message %>
(version <%= version %>)
```

## Interactive prompt

```markup
.
└── _templates/
    └── mailer/
        └── new/           <-- the mailer new generator/
            ├── prompt.js    <-- your prompt file!
            ├── html.ejs.t
            └── text.ejs.t
```

For example, to ask for the `message` input variable, add to `prompt.js`:

```js title="_templates/mailer/new/prompt.js"
module.exports = [
  {
    type: "input",
    name: "message",
    message: "What's your message?",
  },
];
```

:::info

The format is based on [enquirer](https://github.com/enquirer/enquirer#prompt-options).

:::

We can render variables like below:

```ejs title="_templates/mailer/new/text.ejs.t"
---
to: app/emails/<%= name %>.txt
---
<%= message %>
```

To generate it, we'll do this:

```bash
$ hygen mailer new --name fancy-mailer
```

## Advanced Interactive prompt

Structure:

```markup
.
└── my-generator/
    └── my-action/
        ├── index.js
        ├── template1.ejs.t
        └── template2.ejs.t
```

:::info

_my-generator_, _my-action_,_template1_ , _template2_ are dynamic name. You can put any name you want.

**BUT** `index.js` is a special case, hygen will see it as `prompt.js` to generate templates. So you **MUST NOT** name other files as `index.js`

:::

### Basic

Instead of exporting an array of question types as with the `prompt.js` file, you now need to export an object with a function called prompt:

```js title="_templates/my-generator/my-action/index.js"
module.exports = {
  prompt: ({ prompter, args }) =>
    prompter
      .prompt({
        type: "input",
        name: "email",
        message: "What's your email?",
      })
      .then(({ email }) =>
        prompter.prompt({
          type: "input",
          name: "emailConfirmation",
          message: `Please type your email [${email}] again:`,
        })
      ),
};
```

### Skipping prompt

You can return `Promise` to skip prompt conditionally

```js title="_templates/my-generator/my-action/index.js"
module.exports = {
  prompt: ({ prompter, args }) => {
    if (args.age > 18) {
      return Promise.resolve({ allow: true });
    }
    return prompter.prompt({
      type: "input",
      name: "age",
      message: "whats your age?",
    });
  },
};
```

Or you can completely skip prompt by using `params`

```js title="_templates/my-generator/my-action/index.js"
module.exports = {
  params: ({ args }) => {
    return { moreConvenientName: args.foobamboozle };
  },
};
```

### Argument utils module

References: [Advance prompt improvement - Github](https://github.com/jondot/hygen/issues/35#issuecomment-522282209)

```js title="_templates/promptArgsUtil.js"
module.exports =
  (questions) =>
  ({ prompter, args }) => {
    const providedArgs = questions.reduce((selectedArgs, question) => {
      if (args[question.name])
        selectedArgs[question.name] = args[question.name];
      return selectedArgs;
    }, {});
    return prompter.prompt(questions.filter(({ name }) => !providedArgs[name]));
  };
```

Usage:

```js title="_templates/my-generator/my-action/index.js"
const promptArgs = require("../../promptArgsUtil");

const questions = [
  {
    type: "select",
    name: "level",
    message: "What is the level of the component?",
    choices: [
      { title: "Atoms", value: "atoms" },
      { title: "Molecules", value: "molecules" },
      { title: "Organisms", value: "organisms" },
      { title: "Templates", value: "templates" },
    ],
  },
  {
    type: "input",
    name: "name",
    message: "What is the name of the component?",
  },
];
module.exports = {
  prompt: promptArgs(questions),
};
```

## Document your prompt

You can use `message` to build generator help screens.

Looking at our generator layout from before, we add a `help` action:

Structure:

```markup
.
└── _templates/
    └── mailer/
        ├── help/               <-- add new help generator
        │   └── index.ejs.t     <-- and new template
        └── new/
            ├── prompt.js
            ├── html.ejs.t
            └── text.ejs.t
```

Our `index.ejs.t` is simply a blank template, with just a `message:` prop:

```yaml
---
message: |
  - hygen {bold mailer} new --name [NAME]
---
```

:::info

`{bold mailer}` is a special coloring syntax.

For more styles: [chalk](https://github.com/chalk/chalk#styles).

:::

To see the message, just run:

```bash
$ hygen mailer help
```

:::warning

In `hygen@6.2.11`, `chalk.template` has an error. To fix it, use [patch-package](https://github.com/ds300/patch-package) and patch diff below:

```js
diff --git a/node_modules/hygen/dist/logger.js b/node_modules/hygen/dist/logger.js
index 312f112..036c45d 100644
--- a/node_modules/hygen/dist/logger.js
+++ b/node_modules/hygen/dist/logger.js
@@ -5,7 +5,8 @@ var __importDefault = (this && this.__importDefault) || function (mod) {
 Object.defineProperty(exports, "__esModule", { value: true });
 const chalk_1 = __importDefault(require("chalk"));
 // chalk 4.1.2 doesn't type template property
-const { yellow, red, green, magenta, template } = chalk_1.default;
+const { yellow, red, green, magenta } = chalk_1.default;
+const template = require('chalk/source/templates');
 class Logger {
     constructor(log) {
         this.log = log;
```

:::

## Selecting parts of a Generator

The complete form is:

```bash
$ hygen GENERATOR ACTION:SUBACTION
```

Where `SUBACTION` is a regular expression or a simple string hygen uses to pick up the subset of templates you want from a generator.

Since we have a file named `text.ejs.t`, the string text in `new:text` will match it.

```bash
$ hygen mailer new:text --name textual-mailer
```

In the same way we could have used a proper regular expression:

```bash
$ hygen mailer new:.*xt --name textual-mailer
```

## References

[Hygen official doc](https://www.hygen.io/docs/generators)
