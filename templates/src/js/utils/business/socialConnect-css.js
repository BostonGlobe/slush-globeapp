const css = `

.socialconnect {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100vh;
  background-color: rgba(255,255,255,0.85);
  display: -webkit-box;
  display: -webkit-flex;
  display: -ms-flexbox;
  display: flex;
  -webkit-box-align: center;
  -webkit-align-items: center;
      -ms-flex-align: center;
          align-items: center;
  -webkit-box-pack: center;
  -webkit-justify-content: center;
      -ms-flex-pack: center;
          justify-content: center;
}
.socialconnect .display-none {
  display: none;
}
.socialconnect--contain {
  background-color: #fff;
  padding: 3em 1.5em 1em 1.5em;
  box-shadow: 0 0 8px #ccc;
  border-radius: 3px;
  max-width: 25em;
  margin: 1em;
  text-align: center;
  position: relative;
}
.socialconnect--contain * + * {
  margin: 0 auto 1em auto;
  display: block;
}
.socialconnect--contain * + *:last-child {
  margin: 0 auto;
}
.socialconnect--close {
  position: absolute;
  left: 1em;
  top: 1em;
  font-family: Helvetica !important;
  font-weight: normal !important;
  border: none;
  background-color: transparent;
  opacity: 0.5;
  cursor: pointer;
  -webkit-transition: $ease;
  transition: $ease;
}
.socialconnect--close:hover {
  opacity: 1;
}
.socialconnect--hed {
  font-family: Miller-Banner, Georgia, Times, serif;
  font-weight: 700;
  font-style: normal;
  font-size: 2em;
  line-height: 1.1;
  color: #333;
  border-bottom: 1px solid #efefef;
  margin-bottom: 0.5em;
  padding-bottom: 0.25em;
}
.socialconnect--hed span {
  color: #ff6b6b;
  font-style: italic;
}
.socialconnect button {
  font-family: Benton, Helvetica, Arial, sans-serif;
  font-weight: 700;
  font-style: normal;
  cursor: pointer;
  font-size: 0.8em;
  line-height: 1;
}
.socialconnect-facebook--button {
  border: none;
  background-color: #5975b1;
  color: #fff;
  -webkit-transition: $ease;
  transition: $ease;
  padding: 0.75em 1em;
  border-radius: 3px;
  width: 100%;
}
.socialconnect-facebook--button:hover {
  background-color: #3d5281;
}
.socialconnect--separator {
  font-family: Miller-Banner, Georgia, Times, serif;
  font-weight: 700;
  font-style: italic;
  color: #333;
}
.socialconnect--separator:before,
.socialconnect--separator:after {
  content: '';
  display: inline-block;
  vertical-align: middle;
  position: relative;
  width: 43%;
  border-top: 1px solid #efefef;
}
.socialconnect--separator:before {
  right: 1em;
  margin-left: -50%;
}
.socialconnect--separator:after {
  left: 1em;
  margin-right: -50%;
}
.socialconnect-email--input {
  margin: 0 auto 1em auto;
  display: block;
  border-left: none;
  border-right: none;
  border-top: none;
  border-bottom: 5px solid #efefef;
  width: 100%;
  padding: 0.5em 0;
  font-family: Benton, Helvetica, Arial, sans-serif;
  font-weight: 700;
  font-style: normal;
  font-size: 0.9em;
  -webkit-transition: $ease;
  transition: $ease;
}
.socialconnect-email--input:focus {
  outline: none;
  border-bottom: 5px solid #ff6b6b;
}
.socialconnect-email--input:focus::-webkit-input-placeholder {
  color: #333;
}
.socialconnect-email--input:focus::-moz-placeholder {
  color: #333;
}
.socialconnect-email--input:focus:-ms-input-placeholder {
  color: #333;
}
.socialconnect-email--input:focus::placeholder {
  color: #333;
}
.socialconnect-email--button {
  background-color: #f2f2e8;
  border: 1px solid #c1c1b9;
  color: #333;
  -webkit-transition: $ease;
  transition: $ease;
  padding: 0.75em 1em;
  border-radius: 3px;
  width: 100%;
}
.socialconnect-email--button:hover {
  background-color: #333;
  color: #efefef;
  border-color: #333;
}
.socialconnect--small {
  font-family: Benton, Helvetica, Arial, sans-serif;
  font-weight: 400;
  font-style: normal;
  font-size: 0.75em;
  color: #808080;
  padding-top: 1em;
}
.sign-in {
  font-weight: 700;
}
.invisible {
  visibility: hidden;
}

`.trim()

export default css