# APPNAME

This project was generated with [slush-globeapp](https://github.com/BostonGlobe/slush-globeapp). Consult its [README](https://github.com/BostonGlobe/slush-globeapp) for more information.

Please note: do not reproduce Boston Globe logos or fonts without written permission.

## Setup
The app uses handlebars to precompile to HTML. All HTML should be be placed in `src/html/partials/graphic/graphic.hbs`.

## Copy

You can pull copy from either [Methode](#methode) or a [Google Doc](#google-doc).

#### Methode
So you want to tussle with Methode huh? You are brave. Fill out `copy-config.js` like such: 

```
module.exports = {
	...
	methode: {
		section: 'Metro',
		imageDirectory: 'assets/img',
		imageLibrary: '',
		story: [{slug: 'story-slug'}]
	}
};

```

This pipes text and images from Methode into graphic.hbs and downloads the images locally (at multiple resolutions if desired).

You can have it pull from multiple stories by adding more story objects. `imageLibrary` options include 'imager', 'picturefill', and 'lazysizes' (picturefill + lazysizes.js). You are responsible for setting up the corresponding javascript.

Customization should be done in `fetch-methode-story.js`. Be sure to add `src/html/partials/graphic/graphic.hbs` and your methode image directory to the `.gitignore` file.

Running `gulp fetch-methode` at any point will pull down the latest.

#### Google Doc
Using a shared google doc for all copy for an interactive is recommended. The app uses [ArchieML](http://archieml.org) as a micro CMS.

*Setup google doc*
- Create a google doc (outside of Globe domain)
- Publish to web: file -> publish to web
- Make public: share button -> advanced -> change "private only you can access" to "public on the web"
- In the address bar, grab the ID
	- ...com/document/d/ **1IiA5a5iCjbjOYvZVgPcjGzMy5PyfCzpPF-LnQdCdFI0** /edit
- In `copy-config.js` paste in the ID

If the data is too sensitive or a google doc is overkill, you can update `src/data/copy.json` directly. 

Running `gulp fetch-google` at any point will pull down the latest.

#### SEO and Analytics
The following snippet is a bare minimum needed to fill out the basic information for seo and analytics. If you are using a [Google Doc](#google-doc), you can add this in there. Otherwise, put the following code in `src/data/copy.json`.

```
{
	"title": "Graphic title",
	"description": "Description of graphic",
	"keywords": "Comma, delimited, for, seo",
	"url": "https://apps.bostonglobe.com/graphics/path/to/graphic",
	"image_url": "https://apps.bostonglobe.com/graphics/path/to/image",
	"page_id": "apps.mmddyy.title-no-spaces",
	"section": "Metro",
	"chartbeat_section": "metro",
	"header_color": "",
	"credits": [{
		"role": "Development",
		"name": "Russell Goldenberg"
	}, {
		"role": "Design",
		"name": "Elaina Natario"
	}]
}
```

## Deploy
#### Step 1: gulp 
- Run `gulp prod` to deploy. Outputs files into `dist/prod` folder in root. 
- If you setup your ssh credentials, it will also upload the files to the apps server. Otherwise, you must manually put them on the server.
- Your project is now internally visible at http://dev.apps.bostonglobe.com/graphics/[year]/[month]/[project-name].

#### Step 2: publish assets
- In Terminal, connect to shell (your username is usually first initial last name): `ssh rgoldenberg@shell.boston.com`.
- Navigate to your project directory: `cd /web/bgapps/html/graphics/[year]/[month]/[project-name]`.
- Run the command `upload *` in the root **and** each subdirectroy. (ex. `cd css`, then `upload *` to upload all files in that folder).

### Public url
- **https**://apps.bostonglobe.com/graphics/[year]/[month]/[project-name]
- A zipped archive is also pushed to apps. It has the full unminified code for the future when gulp and stuff are fossils.