/*!
 * angular-slick-carousel
 * DevMark <hc.devmark@gmail.com>
 * https://github.com/devmark/angular-slick-carousel
 * Version: 3.1.4 - 2015-12-26T03:01:55.410Z
 * License: MIT
 *
 * Modified by Liveaxle to improve general memory performance and remove leaks.
 */


'use strict';

angular
  .module('slickCarousel', [])
  //global config
  .constant('slickCarouselConfig', {
    method: {},
    event: {}
  })
  .directive('slick', [
    '$timeout', 'slickCarouselConfig', function ($timeout, slickCarouselConfig) {
      return {
        scope: {
          settings: '<?'
        },
        restrict: 'AE',
        link: function (scope, element, attr) {
          //hide slider
          element.css('display', 'none');

          var options, initOptions, destroy, init, destroyAndInit, currentIndex;

          initOptions = function () {
            options = angular.extend(angular.copy(slickCarouselConfig), scope.settings);
          };

          destroy = function () {
            if (element.hasClass('slick-initialized')) {
              element.remove('slick-list');
              element.slick('unslick');
            }
          };

          init = function () {
            initOptions();

            if (element.hasClass('slick-initialized')) {
              if (options.enabled) {
                return element.slick('getSlick');
              } else {
                destroy();
              }
            }
            else {
              element.css('display', 'block');

              if (!options.enabled) {
                return;
              }
              // Event
              element.on('init', function (event, slick) {
                if (typeof options.event.init !== 'undefined') {
                  options.event.init(event, slick);
                }
                if (typeof currentIndex !== 'undefined') {
                  return slick.slideHandler(currentIndex);
                }
              });
              $timeout(function () {
                element.slick(options);
              });
            }

            // Event
            element.on('afterChange', function (event, slick, currentSlide, nextSlide) {
              currentIndex = currentSlide;
              if (typeof options.event.afterChange !== 'undefined') {
                scope.$apply(function () {
                  options.event.afterChange(event, slick, currentSlide, nextSlide);
                });
              }
            });

            element.on('beforeChange', function (event, slick, currentSlide, nextSlide) {
              if (typeof options.event.beforeChange !== 'undefined') {
                scope.$apply(function () {
                  options.event.beforeChange(event, slick, currentSlide, nextSlide);
                });
              }
            });

            element.on('reInit', function (event, slick) {
              if (typeof options.event.reInit !== 'undefined') {
                scope.$apply(function () {
                  options.event.reInit(event, slick);
                });
              }
            });

            if (typeof options.event.breakpoint !== 'undefined') {
              element.on('breakpoint', function (event, slick, breakpoint) {
                scope.$apply(function () {
                  options.event.breakpoint(event, slick, breakpoint);
                });
              });
            }
            if (typeof options.event.destroy !== 'undefined') {
              element.on('destroy', function (event, slick) {
                scope.$apply(function () {
                  options.event.destroy(event, slick);
                });
              });
            }
            if (typeof options.event.edge !== 'undefined') {
              element.on('edge', function (event, slick, direction) {
                scope.$apply(function () {
                  options.event.edge(event, slick, direction);
                });
              });
            }

            if (typeof options.event.setPosition !== 'undefined') {
              element.on('setPosition', function (event, slick) {
                scope.$apply(function () {
                  options.event.setPosition(event, slick);
                });
              });
            }
            if (typeof options.event.swipe !== 'undefined') {
              element.on('swipe', function (event, slick, direction) {
                scope.$apply(function () {
                  options.event.swipe(event, slick, direction);
                });
              });
            }
          };

          var watcher = scope.$watch('settings', function (newVal, oldVal) {
            if (newVal !== null) {
              return destroyAndInit();
            }
          }, true);

          destroyAndInit = function () {
            destroy();
            init();
          };

          scope.$on('$destroy', function () {
            element.off();
            destroy();
            watcher();
          });

          return watcher;

        }
      };
    }
  ]);
