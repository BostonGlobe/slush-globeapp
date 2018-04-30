# APPNAME

This project was generated with [slush-globeapp](https://github.com/BostonGlobe/slush-globeapp). Consult its [README](https://github.com/BostonGlobe/slush-globeapp) for more information.

Please note: do not reproduce Boston Globe logos or fonts without written permission.

## Setup
Clone repo and run `yarn`.

If pulling from google or methode, run the command(s) below to stay up-to-date:

`gulp fetch-google` and `gulp fetch-methode`.

To start the local server, run `gulp`.

## Using Apps with Github
Your apps project is not automatically tracked via git. To do this:

* Initialize git in your project: `git init`

* Add and commit changes as needed

* Start a new repository on Github and follow the instructions to add a remote repository: `git remote add origin [remote repository url]`

* Push to your remote repository: `git push -u origin master`

## Copy

You can pull copy from either [Methode](#methode) or a [Google Doc](#google-doc).

#### Methode
So you want to tussle with Methode huh? You are brave. Fill out `config.js` like such:

```
	...
	"methode": {
		"story": [
			{
				"path": "path/to/xml"
			},
			{
				"path": "path/to/another/xml",
				"filename": "name-of-hbs-file"
			}
		]
	}

```

This pipes text and images from Methode into a handlebar file and downloads the images locally. Objects with a `filename` string will have their Methode text and images written to a file with a corresponding name; using the example above would result in name-of-hbs-file.hbs. Objects without a `filename` will be written to methode.hbs.

To insert a graphic partial inside methode, simply create a new p tag and use the convention `{{graphic:test}}`. Make sure you have the partial `src/html/partials/graphic/test.hbs`.

Running `gulp fetch-methode` at any point will pull down the latest.

##### Methode image options:

*imageLibrary*

Takes a string. The responsive image library you want to use instead of plain old ```img``` elements. Possible values include: ```picturefill, lazy-picturefill```. You are responsible for setting up the JavaScript to make them work (simply `yarn add picturefill` and optionally `lazysizes`).

Example:

``` imageLibrary: 'lazy-picturefill'```

*imageClass*

Boolean value `true` or `false` to give different images from Methode a distinguising class name.

Example:

``` imageClass: true ```

#### Google Doc
Using a shared google doc for all copy for an interactive is recommended. The app uses [ArchieML](http://archieml.org) as a micro CMS.

*Setup google doc*
- Create a google doc (outside of Globe domain)
- Publish to web: file -> publish to web
- Make public: share button -> advanced -> change "private only you can access" to "public on the web"
- In the address bar, grab the ID
	- ...com/document/d/ **1IiA5a5iCjbjOYvZVgPcjGzMy5PyfCzpPF-LnQdCdFI0** /edit
- In `config.js` paste in the ID

If the data is too sensitive or a google doc is overkill, you can update `data/copy.json` directly.

Running `gulp fetch-google` at any point will pull down the latest.

## Fonts
The only two fonts loaded by default are **Miller regular** and **Benton bold**. To load additional fonts you must add info to two places. Follow the current examples in the existing files.
* **src/css/config.styl**
* **src/js/critical.js**

In **config.styl**:
```
set-font('benton-regular')
```

In **critical.js**:
```
loadFont([
	...
	{ family: 'Benton', suffix: 'regular'},
])
```
To set a font, simply add the class name to the element following the pattern `'.family-style'` (ex. `.benton-regular`)

Available fonts:
* `{ family: 'Miller', suffix: 'regular'}` - `.miller-regular`
* `{ family: 'Miller', suffix: 'regular'}` - `.miller-bold`
* `{ family: 'Miller-Banner', suffix: 'regular'}` - `.miller-banner-regular`
* `{ family: 'Miller-Banner', suffix: 'italic'}` - `.miller-banner-italic`
* `{ family: 'Benton', suffix: 'regular'}` - `.benton-regular`
* `{ family: 'Benton', suffix: 'regular'}` - `.benton-bold`
* `{ family: 'Benton-Cond', suffix: 'regular'}` - `.benton-cond-regular`
* `{ family: 'Benton-Comp', suffix: 'regular'}` - `.benton-comp-regular`

## Debugger
If you'd like to debug your HTML for accessibility and semantics, uncomment the `debug.styl` file in your `config.styl`. Documentation is available in `debug.styl`, however most items that are flagged are hoverable with information on what's wrong. Remember to comment it out again before pushing to prod!

## Teasers
Run `gulp fetch-teaser` to pull down the teaser information (based on urls in meta.json). This also pulls in the OG image from each file.

## SEO and Analytics
Fill out *data/meta.json*, the bare minimum needed for seo, analytics, and business. In general, it's a good idea to consult with web editors on the best wording for the "title", "description" and "keywords" fields.

```
{
	"title": "Graphic title",
	"author": "Author name",
	"description": "Description of graphic",
	"keywords": "Comma, delimited, for, seo",
	"url": "https://apps.bostonglobe.com/graphics/path/to/graphic",
	"imageUrl": "https://apps.bostonglobe.com/graphics/path/to/image",
	"section": "Metro",
	"sectionUrl": "https://bostonglobe.com/metro",
	"credits": "",
	"teasers": [],
	"social": true,
	"meter": true, // If false, article is exempt from metering and meter assets do not show
	"socialConnect": true, // Show SocialConnect meter asset (shows even if undefined)
	"progressBar": true, // Show Progress Bar meter asset at bottom (shows even if undefined)
	"ads": false
}
```

* **credits** text of who made this. 
* **teasers**: array of urls

#### Ads
In order for you to slot ads on the page, you must set the specific slots in *data/meta.json* as an array. For example:

```
{
	...,
	"ads": [
		'ad_lead1',
		'ad_inarticle1',
		'ad_inarticle2'
	]
}
```

In order to display the ads, you must slot them using the *base/base-ad-slot* partials. Here are some examples:

```
{{> base/base-ad-slot ad="ad_lead1"}}
```
or
```
{{> base/base-ad-slot ad="ad_inarticle1"}}
```
and if you would like to show an overline to tell the user that what they're seeing is an advertisement:
```
{{> base/base-ad-slot ad="ad_inarticle2" overline="true"}}
```

**Note:** It's important that, when you choose to insert ads in an article, you place the lead1 at the top of the article and then place the 3 inarticle units in the correct order 1 through 3

## Handlebars Helpers
Handlebars helpers exist for comparisons, iteration, and string manipulation. You can add your own handlebars helpers in `src/html/helpers`.

### Usage examples

#### Greater than
Takes 2 parameters and compares if `a > b`.
Outputs a block if true.
```
{{#greaterThan foo 0}}{{foo}}{{/greaterThan}}
```

#### Less than
Takes 2 parameters and compares if `a < b`.
Outputs a block if true.
```
{{#lessThan results 1}}<p>No results found. Sorry!</p>{{/lessThan}}
```

#### If Equals
Takes 2 parameters and compares if `a === b`.
Outputs a block if true.
```
<div class="foo {{#ifEquals hidden true}}hidden{{/ifEquals}}">...</div>
```

#### Loop
Takes 3 parameters (start number, end number, incremenation per iteration).
Outputs blocks based on iteration count.
```
<ul>
	{{#loop 1 10 1}}
		<li>{{this}}</li>
	{{/loop}}
</ul>
```

#### Slugify
Takes string, converts it to lowercase, and replaces spaces with hyphens
```
<div style='background-image: url("assets/lead/{{stringToUrl 'Part one Lead image'}}.jpg")'>
```

##Multipage
If a project is to be serialized with multiple articles, you can set up the functionality and architecture by choosing the `Multipage` option when generating a project with [slush-globeapp](https://github.com/BostonGlobe/slush-globeapp).

####File Structure
The main index file for a multipage project remains `src/html/index.hbs`.

To add subpages, create folders and handlebar files under  `src/html/multipage/` and their names will be reflected in the url.

For example:

```
.
+--src
|	 +--html
|	 		+--multipage
|				 +--part
|						+--one.hbs
|						+--two
|							 +--index.hbs
```

Will produce pages at `/[section]/graphics/[year]/[month]/[graphic-name]/part/one` and `/[section]/graphics/[year]/[month]/[graphic-name]/part/two` respectively.

####Layout
A `layout` template is provided that sets up a page's HTML and is used as follows:

```
{{#> layout}}
	{{> graphic/your-partial-here}}
	{{> graphic/another-partial-here}}
{{/layout}}
```

This will render a full page's markup with the partial blocks nested within `<main id="content"></main>`

####Metadata
Metadata can be set up for each page by creating a new object in `data/meta.json` like so:

```
{
	"index": {...},
	"partOne": {
		"title": "Part One title",
		"author": "Author name",
		"description": "Description of part one",
		"keywords": "Comma, delimited, for, seo",
		"url": "https://apps.bostonglobe.com/graphics/path/to/graphic/part/one",
		"imageUrl": "https://apps.bostonglobe.com/graphics/path/to/image",
		"section": "Metro",
		"sectionUrl": "https://bostonglobe.com/metro",
		"credits": "",
		"teasers": [],
		"social": true,
		"meter": true,
		"socialConnect": true,
		"ads": false
	}
}
```

And passing it to the `layout` template like the following:

```
{{#> layout meta.partOne}}
	{{> graphic/your-partial-here}}
{{/layout}}
```

Any undefined fields will default to the index object.

####Other Notes
- `main.css`, `bundle.js`, and `critical.js` are global for all subpages.
- Asset paths should be absolute, referencing the config path. For example: `/[section]/graphics/[year]/[month]/[graphic-name]/assets`
- `gulp fetch-teaser` will only pull from the `teasers` array in `meta.index`.
- `gulp fetch-methode` still only outputs to one `methode.hbs` file.
- Future enhancements will allow for more flexibility with the previous notes.

## Deploy
#### Step 1: make a project folder on apps
- Either connect to the apps server (`smb://legacydocroot.globe.com/web/bgapps/html/`) or connect to shell and navigate to your directory (`cd /web/bgapps/html/[section]/graphics/[year]/[month]/`).
- If you're using the finder, simply make a new folder in the correct directory with your project name (reference `config.json` for your project name).
- If you're using terminal, `mkdir [your-project-name]`

#### Step 2: gulp
- Run `gulp prod -u username` to deploy. Outputs files into `dist/prod` folder in root.
- Optional: Use the flag `--html` to only upload the index.html file (use this if you have no updates to assets and want faster upload)
- Your graphic is now internally visible at http://dev.apps.bostonglobe.com/[section]/graphics/[year]/[month]/[graphic-name].

#### Step 3: publish assets
- In Terminal, connect to shell (your username is usually first initial last name): `ssh rgoldenberg@shell.boston.com`.
- Navigate to your graphic directory: `cd /web/bgapps/html/[section]/graphics/[year]/[month]/[graphic-name]`.
- Run the command `upload *` in the root **and** each subdirectroy. (ex. `cd css`, then `upload *` to upload all files in that folder).

### Public url
- **https**://apps.bostonglobe.com/[section]/graphics/[year]/[month]/[graphic-name]
- A zipped archive is also pushed to apps. It has the full unminified code for the future when gulp and stuff are fossils.
