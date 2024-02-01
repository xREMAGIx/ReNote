---
sidebar_position: 1
---

# Templates

A hygen template is a header of a markdown-like frontmatter and a body of an ejs templating engine.

## Overview

The `templates` directory contains a set of files and directories that will be copied to the destination directory when the template is invoked.

## Template Structure

A Hygen template structure is as follows:

```js
/* Metadata section using Frontmatter (Frontmatter section) */
---
to: app/emails/<%= name %>.html
---
/* Body section using ejs */
Hello <%= name %>,
<%= message %>
(version <%= version %>)
```

The frontmatter section is used to define the destination path of the file.

The body section is used to define the contents of the file. The body section is rendered using the [ejs](https://ejs.co/) templating engine.

The `.ejs.t` extension is used to indicate that the file is a template in Hygen (optional).

## Frontmatter

The frontmatter section is used to define the destination path of the file. The frontmatter section is defined using the [YAML](https://yaml.org/) format.

The frontmatter is delimited by a matching `---` top and bottom with yaml in it, where we define the template metadata.

For example we have this template:

```yaml _templates/mailer/campaign/emails.ejs.t
---
to: app/emails/<%= name %>.html
---
```

When we invoke the template, we can pass in the `name` variable:

```bash
hygen mailer campaign emails --name=welcome
```

This will create a file at `app/emails/welcome.html`. And this frontmatter section will be replaced with the following:

```yaml
---
to: app/emails/welcome.html
---
```

Some properties that we usually use:

| Property       | Type         | Default   | Example                                |
| -------------- | ------------ | --------- | -------------------------------------- |
| to:            | String (url) | undefined | my-project/readme.md                   |
| from:          | String (url) | undefined | shared/docs/readme.md                  |
| force:         | Boolean      | false     | true                                   |
| unless_exists: | Boolean      | false     | true                                   |
| inject:        | Boolean      | false     | true                                   |
| after:         | Regex        | undefined | devDependencies                        |
| skip_if:       | Regex        | undefined | myPackage                              |
| sh:            | String       | undefined | echo: "Hello this is a shell command!" |

## Template body

Templates bodies are [ejs](https://ejs.co/):

```jsx
---
to: app/workers/<%=name%>.js
---

/* Body section using ejs */
<%
 Message = message.toUpperCase()
%>

class <%= Name %> {
    work(){
        return "<%= Message %>"
    }
}
```

In hygen, the variable `name` is blessed, because you can get a capitalized version of it by saying `Name`.

If we wanted to capitalize some other variable (for example: `message`) then we could do like above.

## Helpers

You can also use the built-in helpers by accessing `h`:

### Inflections

`h` hosts this [inflections](https://github.com/dreamerslab/node.inflection) package.

```js
// example: <%= h.inflection.pluralize(name) %>

pluralize(str, plural);
singularize(str, singular);
inflect(str, count, singular, plural);
camelize(str, low_first_letter);
underscore(str, all_upper_case);
humanize(str, low_first_letter);
capitalize(str);
dasherize(str);
titleize(str);
demodulize(str);
tableize(str);
classify(str);
foreign_key(str, drop_id_ubar);
ordinalize(str);
transform(str, arr);
```

### Change-case

`h` provides ability to semantic case changing with [change-case](https://github.com/blakeembrey/change-case) library

```js
// example: <%= h.changeCase.camel(name) %>

camel(str);
constant(str);
dot(str);
header(str);
isLower(str);
isUpper(str);
lower(str);
lcFirst(str);
no(str);
param(str);
pascal(str);
path(str);
sentence(str);
snake(str);
swap(str);
title(str);
upper(str);
```

For example we have:

```jsx title="/templates/components/new"
---
to: components/<%= name %>/index.jsx
---
export const <%= name %> = () => (
  <div className="<%= h.changeCase.param(name) %>" />
)
```

When we run

```bash
hygen components new --name=HelloWorld
```

It will be compile to:

```jsx
export const HelloWorld = () => <div className="hello-world" />;
```

## Local variables

There are two ways to refer to variables:

### Directive

```ejs
Hello <%= message %>
```

This way refers to the message CLI argument or prompt parameter, in its bare form.

This also means this parameter **cannot be optional** (otherwise a reference error is thrown).

### Via objects

```ejs
Hello <%= locals.message %>
```

This way refers to the message CLI argument or prompt parameter, through the `locals` object.

This is great if you want to check a variable for existance before using it like so:

```ejs
<% if(locals.message){ -%>
    message: <%= message %>
<% } -%>
```

## Predefined variables

```bash
hygen component new:story
```

`hygen` will break it up for you and place certain values in special variables that are automatically available in your templates:

| Variables    | Content                   | Example                       |
| ------------ | ------------------------- | ----------------------------- |
| templates    | Templates path (absolute) | /User/.../project/\_templates |
| actionfolder | Action path               | /.../component/new            |
| generator    | Generator name            | component                     |
| action       | Action name               | new                           |
| subaction    | Sub-action name           | story                         |
| cwd          | Process working directory | /User/.../project             |

For example to use `actionfolder` say:

```ejs
<%= actionfolder %>
```

## Addition

By default templates are 'added' to your project as a new target file.

By specifying a `to:` frontmatter property, we're telling hygen where to put it. `force: true` will tell hygen to overwrite an existing file without prompting the user ( default is `force: false` ).

```ejs
---
to: app/index.js
force: true
---
console.log('this is index!')
```

If a target file already exists, and you don't want to overwrite it, you can use `unless_exists`.

```ejs
---
to: app/index.js
unless_exists: true
---
will not render if target exists
```

## From & shared templates

By default the body of the template is used as input to create the target file.

By specifying a `from:` frontmatter property, we're telling hygen from which external file to load the body from.

E.g. `from: shared/docs/readme.md` will tell hygen to load the body from `_templates/shared/docs/readme.md`. The body of this template is ignored

```ejs
---
to: app/readme.md
from: shared/docs/readme.md
---
THIS BODY IS IGNORED !!!
```

## Injection

You can also choose to inject a template into an existing target file.

For this to work, you need to use `inject: true` with the accompanied inject-specific props.

```ejs
---
inject: true
to: package.json
after: dependencies
skip_if: react-native-fs
---
"react-native-fs":"*",
```

This template will add the _react-native-fs_ dependency into a _package.json_ file, but it will not add it twice (because of `skip_if`).

| Property | Description                                                                                            |
| -------- | ------------------------------------------------------------------------------------------------------ |
| before   | contain a regular expression of text to locate. The inject line will appear _before_ the located line. |
| after    | contain a regular expression of text to locate. The inject line will appear _after_ the located line.  |
| prepend  | add a line to _start_ of file respectively.                                                            |
| append   | add a line to _end_ of file respectively.                                                              |
| at_line  | contains a line number will add a line at this exact line number.                                      |
| skip_if  | contains a regular expression / text. If exists, injection is skipped.                                 |

## Shell

Shell actions give you the ability to trigger any shell commands. You can do things such as:

- Copy a resource or an asset from a template into a target folder
- Pipe the output of a template into a shell command
- Perform any other side-effect - `touch` files, restart processes, trigger a `yarn install` or what have you.

Here's how to pipe a generator's output into a shell command:

```ejs
---
sh: "mkdir -p <%= cwd %>/given/app/shell && cat > <%= cwd %>/given/app/shell/hello.piped"
---
hello, this was piped!
```

Note that you have the `cwd` variable pre-available to you to indicate the current working directory.

Some times you want to run a generator and just invoke an additional command. This means the shell action can be added to what ever action you wanted to perform (inject or addition).

Here's a common task: add a dependency and then run yarn install.

```ejs
---
inject: true
to: package.json
after: dependencies
skip_if: lodash
sh: cd <%= cwd %> && yarn install
---
"lodash":"*",
```

## Conditional rendering

```ejs
---
to: "<%= message ? `where/to/render/${name}.js` : null %>"
---
conditionally rendering template
```

When hygen meets a `to:` value that is `null`, it will skip the output of that template, meaning it won't get rendered at all.

## References

[Hygen official doc](https://www.hygen.io/docs/templates)
