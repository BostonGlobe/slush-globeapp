# slush-globeapp

Generator for standalone app

### Prerequisites

- Install [slush](https://github.com/slushjs/slush) and [this generator](https://www.npmjs.com/package/slush-globeapp): `npm install -g slush slush-globeapp`
- If the above gives you trouble, run it as super-user: `sudo npm install -g slush slush-globeapp`

### Quick start
To create a new app, create a new directory (ex: `mkdir project-name`), `cd` into it, and run
    
    slush globeapp

Follow all prompts.


### Business

1. Make any changes to business files in this repo
2. Create new app 
3. Run `gulp css-business`
4. Put outputs from *business* into the *socialConnect-css.js* and *paywall-css.js* in this repo 
5. Create another new app
6. Run `gulp js-business`
7. In *business* manually version bump
7. Deploy to dev.apps and upload
8. Update reference in *base-critical.hbs*