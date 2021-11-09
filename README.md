# JavaScript Bookmark Utilities
Useful JavaScript utilities that can be added as a bookmark to do useful things on the current page. Create a bookmark JavaScript function:

The source for these is in the `******.js` files. I have taken them, flattened them into a single line `javascript` URL and created a bookmark import file you can use. From Chrome or Firefox, import the `import.html` file as an HTML bookmark file.

For other browsers, you can still use that HTML as you see fit. For examle, open the `import.html` file and then right-click copy the link for the ones you like and then create a bookmark using the copied URL.

# Background

You can turn any anonymous JavaScript function into a bookmark. Then, once you have it as a bookmark, you can then click on that bookmark to invoke the function on any webpage. 

> Before some of you get concerned about security, this is really exactly the same thing as opening the JavaScript console of a browser and pasting the function into the console.

Here is an example. Say you have the following function:
```
//show count of inputs, textarea, and select elements, and the total number of all three
function foo() {
  const names = [ "input","textarea","select" ];
  const stats = {'all' : 0};
  names.forEach(function(name) {
    const count = document.getElementsByTagName(name).length;
    stats[name] = count;
    stats.all = stats.all + count;
  });
  alert(JSON.stringify(stats));
}
```

Rather than having to open the JavaScript console, copying the function from your personal library and then pasting it into the console, you can simply create a bookmark that does the same thing.

- Flatten the code into a single line wrapped in an anonymous function that you call ...
  ```
  (function(){ const names = [ "input","textarea","select" ];const stats = {'all' : 0};names.forEach(function(name) {const count = document.getElementsByTagName(name).length;stats[name] = count;stats.all = stats.all + count;});alert(JSON.stringify(stats));})();
  ```
- Create a bookmark.
  - Name the bookmark: `Show Input Textarea Select Stats` for example.
  - Set the bookmark URL to 'javascript:' + the  sinble line anonymized function above...
  ```
  javascript:(function(){ const names = [ "input","textarea","select" ];const stats = {'all' : 0};names.forEach(function(name) {const count = document.getElementsByTagName(name).length;stats[name] = count;stats.all = stats.all + count;});alert(JSON.stringify(stats));})();
  ```
Now you can click the bookmark to execute the function on any webpage you are looking at.
