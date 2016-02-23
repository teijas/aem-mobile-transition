# aem-mobile-transition

This is a jquery plugin that emulates the expand and contract transition used in Adobe DPS (now called AEM Mobile) applications using CSS animations.

##Getting Started
Include the aem-mobile-transition js and css files in your project. 

```html 
<script src="js/aem-mobile-transition.js"></script>
```  
```html 
<link rel="stylesheet" type="text/css" href="css/aem_mobile_transition.css">
```  

Also include jQuery and jquery.keyframes.js. [JQuery Keyframes](https://github.com/Keyframes/jQuery.Keyframes) is required to dynamically create the proper CSS keyframes for the transition. 

```html 
<script src="js/jquery.js"></script>
```  
```html 
<script src="js/jquery.keyframes.min.js"></script>
```

###Articles
This is the div that your 'card' element will expand to. Give your article a class of `.article` and a unique id. 

```html 
<div class="article" id="page1"> 
  ... 
</div>
```

###Cards
Give each card element a `data-target` attribute that points to the corresponding article.

```html 
<div class="your-card-class" data-target="#page1"> 
    ... 
</div>
```

###Back Button  
The back button triggers the contract animation. You can include it inside your `.article` or anywhere else on the page that is visible after the article has expanded (e.g. in the header). Just give the back button an id of `#backBtn` or pass in a custom id as an option (see below).
```html
<div class="your-card-class" data-target="#page1">
  ...
  <button class="btn btn-warning" id="backBtn">Go Back</button>
</div>
```

###Initialize 

```js
$('.your-card-element').dpsTransition();
```

##Options  
###'back'
Allows you to pass in a custom id for the back button.
```js
  $('.your-card-element').dpsTransition({'back':'#yourBtn'});
```
###'header'
If your layout has a header that is visible when the article expands, include the height of the header in this option.
```js
  $('.your-card-element').dpsTransition({'header':'50'});
```
###'article'
Instead of using the `data-target` attribute you can pass in the article id here.
```js
  $('.your-card-element').dpsTransition({'article':'#yourArticleId'});
```

