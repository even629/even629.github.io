/**
 * Lightbox for post images using Fancybox.
 * Ported from Butterfly theme (source/js/utils.js loadLightbox + main.js runLightbox).
 *
 * Wraps article images in <a data-fancybox="gallery"> and binds Fancybox
 * so clicking an image opens a full-featured lightbox with zoom, rotate,
 * slideshow, and thumbnail strip.
 */
document.addEventListener('DOMContentLoaded', function () {
  // Select post body images, excluding .no-lightbox and inline images
  var imgs = document.querySelectorAll('.content.e-content img:not(.no-lightbox):not(.inline-img)');

  imgs.forEach(function (img) {
    // Skip images already wrapped in a link
    if (img.parentNode.tagName === 'A') return;

    var src = img.src;
    var caption = img.title || img.alt || '';

    var a = document.createElement('a');
    a.href = src;
    a.setAttribute('data-fancybox', 'gallery');
    if (caption) {
      a.setAttribute('data-caption', caption);
    }

    img.parentNode.insertBefore(a, img);
    a.appendChild(img);
  });

  // Bind Fancybox with the same toolbar as Butterfly
  if (typeof Fancybox !== 'undefined') {
    Fancybox.bind('[data-fancybox="gallery"]', {
      Hash: false,
      Thumbs: {
        showOnStart: false
      },
      Images: {
        Panzoom: {
          maxScale: 4
        }
      },
      Carousel: {
        transition: 'slide'
      },
      Toolbar: {
        display: {
          left: ['infobar'],
          middle: [
            'zoomIn',
            'zoomOut',
            'toggle1to1',
            'rotateCCW',
            'rotateCW',
            'flipX',
            'flipY'
          ],
          right: ['slideshow', 'thumbs', 'close']
        }
      }
    });
  }
});
