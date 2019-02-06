export default function wireSocialButtons({ facebook, twitter, mail }) {
  const { href } = window.location;
  const text = document.title;
  const encodedText = encodeURIComponent(text);

  const mailLink = `mailto:?subject=${encodedText}&body=${encodedText}%0A%0A${href}`;
  const mailNode = document.querySelectorAll(mail);

  for (let m = 0; m < mailNode.length; m += 1) {
    mailNode[m].setAttribute('href', mailLink);
  }

  const facebookLink = `https://www.facebook.com/sharer/sharer.php?u=${encodeURI(href)}`;
  const facebookNode = document.querySelectorAll(facebook);

  for (let f = 0; f < facebookNode.length; f += 1) {
    facebookNode[f].setAttribute('href', facebookLink);
  }

  const twitterLink = `https://twitter.com/intent/tweet?text=${encodedText}&via=BostonGlobe&url=${encodeURI(href)}`;
  const twitterNode = document.querySelectorAll(twitter);

  for (let t = 0; t < twitterNode.length; t += 1) {
    twitterNode[t].setAttribute('href', twitterLink);
  }
}
