# snippet-node-new-website
This is a snippet for start a new Node website project.

## Syntax :
* SCSS
* JS
* Jade

## Install :
* *npm install*

## Config :
* Update */mixins/params.js*
* Develop the pages in the */home* folder
* One page is constitute of *js* folder, *scss* folder, *index.jade* file and *controller.js* file
* */www/components* content other script. Add the path on the */mixins* params.js* file for to compile.

## Launch :
* *npm run start*

## Debug :
If node-sass can't install use this command :
```
sudo npm install --unsafe-perm node-sass
```