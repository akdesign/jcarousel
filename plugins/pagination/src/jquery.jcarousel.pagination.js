/*!
 * jCarousel Pagination Plugin v@VERSION
 * http://sorgalla.com/jcarousel/
 *
 * Copyright 2011, Jan Sorgalla
 * Dual licensed under the MIT (http://www.opensource.org/licenses/mit-license.php)
 * or GPL Version 2 (http://www.opensource.org/licenses/gpl-2.0.php) licenses.
 *
 * Date: @DATE
 */
jCarousel(function(jCarousel, $) {
    jCarousel.plugin('pagination', {
        options: {
            perpage: null,
            item: function(page) {
                return '<a class="jcarousel-pagination-item" href="#' + page + '">' + page + '</a>';
            },
            active: function(item) {
                item.addClass('jcarousel-pagination-item-active');
            },
            inactive: function(item) {
                item.removeClass('jcarousel-pagination-item-active');
            }
        },
        pages: {},
        items: {},
        _init: function() {
            this.carousel()
                .bind('jcarouselreloadend.' + this.pluginName, $.proxy(this.reload, this))
                .bind('jcarouselreloadend.' + this.pluginName, $.proxy(this.update, this))
                .bind('jcarouselscrollend.' + this.pluginName, $.proxy(this.update, this));

            this.reload();
            this.update();
        },
        _destroy: function() {
            this.element.empty();
        },
        reload: function() {
            var self = this,
                // We can only control 1 carousel
                carousel = this.carousel().data('jcarousel'),
                o = this.options;

            this.pages = {};
            this.items = {};

            // Calculate pages
            if (o.perpage == null) {
                o.perpage = function() {
                    var items = carousel.items(),
                        clip  = carousel._clipping(),
                        wh    = 0,
                        idx   = 0,
                        page  = 1,
                        pages = {},
                        curr;

                    while (true) {
                        curr = items.eq(idx++);

                        if (curr.size() === 0) {
                            break;
                        }

                        if (!pages[page]) {
                            pages[page] = curr;
                        }

                        wh += carousel._dimension(curr);

                        if (wh >= clip) {
                            page++;
                            wh = 0;
                        }
                    }

                    return pages;
                };
            }

            if ($.isFunction(o.perpage)) {
                this.pages = o.perpage.call(this);
            } else {
                var pp    = jCarousel.intval(o.perpage),
                    items = carousel.items(),
                    page  = 1,
                    i     = 0,
                    curr;

                while (true) {
                    curr = items.eq(i);

                    if (curr.size() === 0) {
                        break;
                    }

                    this.pages[page++] = curr;
                    i += pp;
                }
            }

            this.element.empty();

            $.each(this.pages, function(page, carouselItem) {
                var el = $(o.item.call(self, page, carouselItem));

                el
                    .click(function(e) {
                        e.preventDefault();
                        carousel.scroll(carouselItem);
                    })
                    .data('jcarousel-pagination-item', jCarousel.intval(page))
                    .appendTo(self.element);

                self.items[page] = el;
            });
        },
        update: function() {
            var self = this,
                // We can only control 1 carousel
                carousel = this.carousel().data('jcarousel');

            $.each(this.pages, function(page, carouselItem) {
                var el = self.items[page];
                if (carousel.target().index(carouselItem) >= 0) {
                    el.data('jcarousel-pagination-item-active', true);
                    self.options.active.call(self, el);
                } else {
                    el .data('jcarousel-pagination-item-active', false)
                    self.options.inactive.call(self, el);
                }
            });
        }
    });

});
