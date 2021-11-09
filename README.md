# JavaScript Bookmark Utilities
Useful JavaScript utilities that can be added as a bookmark to do useful things on the current page. Create a bookmark JavaScript function:

- Take the function of interest and flatten it to one line.
- Prefix the line with "javascript:"
- Open Chrome and create a bookmark of anything.
- Edit the bookmark:
  - Five it a reasonable name.
  - Take the "javascript:...." single line and paste it into the URL portion of the bookmark.
- Save the bookmark.


# Example

- Say you have the following function...
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
- Anonymize, flatten and call the function...
  ```
  (function(){ const names = [ "input","textarea","select" ];const stats = {'all' : 0};names.forEach(function(name) {const count = document.getElementsByTagName(name).length;stats[name] = count;stats.all = stats.all + count;});alert(JSON.stringify(stats));})();
  ```
- Create a bookmark of any webpage
- Edit the bookmark and named it `Show Input Textarea Select Stats`
- Set the boomaruk URL to 'javascript:' + the  sinble line anonymized function above...
  ```
  javascript:(function(){ const names = [ "input","textarea","select" ];const stats = {'all' : 0};names.forEach(function(name) {const count = document.getElementsByTagName(name).length;stats[name] = count;stats.all = stats.all + count;});alert(JSON.stringify(stats));})();
  ```
- Now you can click the bookmark to execute the function on any webpage you are looking at.
