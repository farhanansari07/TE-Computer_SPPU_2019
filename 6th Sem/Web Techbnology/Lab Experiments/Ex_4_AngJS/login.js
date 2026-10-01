/* ============================================================
   RHYTHMIX LOGIN — login.js
   Framework : AngularJS 1.8.3
   ============================================================

   ANGULARJS CONCEPTS USED (pinpointed):
   ─────────────────────────────────────────────────────────────
   1.  angular.module()       — Creates / registers the app module
   2.  .controller()          — Registers a controller with $scope
   3.  $scope                 — The ViewModel; bridges controller ↔ view
   4.  ng-app                 — Bootstraps the app (in HTML)
   5.  ng-controller          — Attaches controller to a DOM section
   6.  ng-model               — Two-way data binding on inputs
   7.  ng-submit              — Intercepts form submission
   8.  ng-show / ng-hide      — Conditionally shows/hides elements
   9.  ng-if                  — Conditionally renders elements in DOM
   10. ng-class               — Dynamically applies CSS classes
   11. ng-click               — Binds click events to scope functions
   12. ng-disabled            — Conditionally disables a button
   13. ng-attr-type           — Dynamically sets an HTML attribute
   14. $scope.$watch          — (optional) watches model changes
   15. $timeout               — Angular's safe wrapper for setTimeout
   ─────────────────────────────────────────────────────────────
*/

/* ============================================================
   STEP 1 — Define the Angular Module
   angular.module(name, [dependencies])
   The empty array [] means no external dependencies.
============================================================ */
var app = angular.module('rhythmixApp', []);


/* ============================================================
   STEP 2 — Define the Controller
   Controllers manage application data and behaviour.
   $scope  : The shared data object between HTML and JS.
   $timeout: Angular's $timeout is used instead of setTimeout
             so Angular's digest cycle stays aware of changes.
============================================================ */
app.controller('LoginController', ['$scope', '$timeout', function($scope, $timeout) {

  /* ──────────────────────────────────────────────────────────
     $scope.credentials
     The model object bound via ng-model in the HTML.
     Any keypress in the inputs automatically updates these.
  ────────────────────────────────────────────────────────── */
  $scope.credentials = {
    username : '',
    password : ''
  };

  /* ──────────────────────────────────────────────────────────
     UI state flags — controlled in controller, read in HTML
     via ng-show, ng-hide, ng-disabled, ng-if directives.
  ────────────────────────────────────────────────────────── */
  $scope.showPassword    = false;   // toggles password visibility
  $scope.isLoading       = false;   // shows spinner while "logging in"
  $scope.submitAttempted = false;   // tracks if submit was clicked once


  /* ──────────────────────────────────────────────────────────
     FUNCTION: togglePassword()
     Bound to the eye button via ng-click="togglePassword()".
     Flips $scope.showPassword, which drives ng-attr-type on
     the password <input> — switching between 'text' and
     'password' input types.
  ────────────────────────────────────────────────────────── */
  $scope.togglePassword = function() {
    $scope.showPassword = !$scope.showPassword;
  };


  /* ──────────────────────────────────────────────────────────
     FUNCTION: loginUser()
     Bound to the <form> via ng-submit="loginUser()".

     VALIDATION LOGIC (AngularJS approach):
     - $scope.loginForm is the FormController object Angular
       creates automatically for every named <form>.
     - $scope.loginForm.$invalid is true if ANY required field
       is empty (Angular tracks this natively via `required`).
     - Calling $scope.loginForm.username.$setDirty() forces
       Angular to show validation styles even on first submit.

     REDIRECT LOGIC:
     - Sets $scope.isLoading = true (shows spinner, disables btn)
     - Uses $timeout (Angular's setTimeout) to simulate a
       loading delay, then redirects to index.html.
     - Stores username in sessionStorage so Rhythmix can read
       and display the logged-in user's name.
  ────────────────────────────────────────────────────────── */
  $scope.loginUser = function() {

    // Mark all fields as dirty so ng-class validation styles trigger
    $scope.loginForm.username.$setDirty();
    $scope.loginForm.password.$setDirty();
    $scope.submitAttempted = true;

    // If either field is empty — stop here
    if ($scope.loginForm.$invalid) {
      return;
    }

    // Both fields filled — proceed with login
    $scope.isLoading = true;

    // Save username to sessionStorage so Rhythmix (index.html) can greet user
    sessionStorage.setItem('rhythmix_session_user', $scope.credentials.username.trim());

    // Simulate a short loading delay (500ms), then navigate
    $timeout(function() {
      window.location.href = 'index.html';
    }, 600);
  };


  /* ──────────────────────────────────────────────────────────
     FUNCTION: loginAsGuest()
     Bound via ng-click="loginAsGuest()".
     Stores "Guest" as the session username and redirects
     immediately without any form validation.
  ────────────────────────────────────────────────────────── */
  $scope.loginAsGuest = function() {
    sessionStorage.setItem('rhythmix_session_user', 'Guest');
    $scope.isLoading = true;
    $timeout(function() {
      window.location.href = 'index.html';
    }, 400);
  };


  /* ──────────────────────────────────────────────────────────
     OPTIONAL: $scope.$watch example
     Watches the username field; trims whitespace in real time.
     Demonstrates the $watch concept for the assignment.
  ────────────────────────────────────────────────────────── */
  $scope.$watch('credentials.username', function(newVal) {
    if (newVal && newVal !== newVal.trim()) {
      $scope.credentials.username = newVal.trim();
    }
  });

}]);
