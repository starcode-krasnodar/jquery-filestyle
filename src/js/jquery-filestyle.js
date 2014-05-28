/*
 * jquery-filestyle
 * doc: http://markusslima.github.io/jquery-filestyle/
 * github: https://github.com/markusslima/jquery-filestyle
 *
 * Copyright (c) 2014 Markus Vinicius da Silva Lima
 * Version 1.0.0
 * Licensed under the MIT license.
 */
(function ($) {
    "use strict";
    
    var JFilestyle = function (element, options) {
        this.options = options;
        this.$elementjFilestyle = [];
        this.$element = $(element);
    };

    JFilestyle.prototype = {
        clear: function () {
            this.$element.val('');
            this.$elementjFilestyle.find(':text').val('');
        },

        destroy: function () {
            this.$element
                .removeAttr('style')
                .removeData('jfilestyle')
                .val('');
            this.$elementjFilestyle.remove();
        },

        icon: function (value) {
            if (value === true) {
                if (!this.options.icon) {
                    this.options.icon = true;
                    this.$elementjFilestyle.find('label').prepend(this.htmlIcon());
                }
            } else if (value === false) {
                if (this.options.icon) {
                    this.options.icon = false;
                    this.$elementjFilestyle.find('i').remove();
                }
            } else {
                return this.options.icon;
            }
        },

        input: function (value) {
            if (value === true) {
                if (!this.options.input) {
                    this.options.input = true;
                    this.$elementjFilestyle.prepend(this.htmlInput());

                    var content = '',
                        files = [];
                    if (this.$element[0].files === undefined) {
                        files[0] = {'name': this.$element[0].value};
                    } else {
                        files = this.$element[0].files;
                    }

                    for (var i = 0; i < files.length; i++) {
                        content += files[i].name.split("\\").pop()+', ';
                    }
                    if (content !== '') {
                        this.$elementjFilestyle.find(':text').val(content.replace(/\, $/g, ''));
                    }
                }
            } else if (value === false) {
                if (this.options.input) {
                    this.options.input = false;
                    this.$elementjFilestyle.find(':text').remove();
                }
            } else {
                return this.options.input;
            }
        },

        buttonText: function (value) {
            if (value !== undefined) {
                this.options.buttonText = value;
                this.$elementjFilestyle.find('label span').html(this.options.buttonText);
            } else {
                return this.options.buttonText;
            }
        },

        iconName: function (value) {
            if (value !== undefined) {
                this.options.iconName = value;
                if (this.options.theme.search(/blue|green|red|orange|black/i) !== -1) {
                    this.$elementjFilestyle.find('label').find('i').attr({'class': 'icon-white '+this.options.iconName});
                } else {
                    this.$elementjFilestyle.find('label').find('i').attr({'class': this.options.iconName});
                }
            } else {
                return this.options.iconName;
            }
        },

        size: function (value) {
            if (value !== undefined) {
                this.options.size = value;
                this.$elementjFilestyle.find(':text').css('width', this.options.size);
            } else {
                return this.options.size;
            }
        },

        htmlIcon: function () {
            if (this.options.icon) {
                var colorIcon = '';
                if (this.options.theme.search(/blue|green|red|orange|black/i) !== -1) {
                    colorIcon = ' icon-white ';
                }

                return '<i class="'+colorIcon+this.options.iconName+'"></i> ';
            } else {
                return '';
            }
        },

        htmlInput: function () {
            if (this.options.input) {
                return '<input type="text" style="width:'+this.options.size+'" disabled> ';
            } else {
                return '';
            }
        },

        constructor: function () {
            var _self = this,
                html = '',
                id = this.$element.attr('id'),
                $label,
                files = [];

            if (id === '' || !id) {
                id = 'jfilestyle-'+$('.jfilestyle').length;
                this.$element.attr({'id': id});
            }
            
            html = this.htmlInput()+
                 '<span class="focus-jfilestyle"><label for="'+id+'">'+
                    this.htmlIcon()+
                    '<span>'+this.options.buttonText+'</span>'+
                 '</label></span>';

            this.$elementjFilestyle = $('<div class="jfilestyle '+this.options.theme+'">'+html+'</div>');
            $label = this.$elementjFilestyle.find('label');
            this.$elementjFilestyle.find('.focus-jfilestyle')
                .attr('tabindex', "0")
                .keypress(function (e) {
                    if (e.keyCode === 13 || e.charCode === 32) {
                        $label.click();
                        return false;
                    }
                });

            // hidding input file and add filestyle
            this.$element
                .css({'position': 'absolute', 'clip': 'rect(0px 0px 0px 0px)'})
                .attr('tabindex', "-1")
                .after(this.$elementjFilestyle);

            // Getting input file value
            this.$element.change(function () {
                var content = '';
                if (this.files === undefined) {
                    files[0] = {'name': this.value};
                } else {
                    files = this.files;
                }

                for (var i = 0; i < files.length; i++) {
                    content += files[i].name.split("\\").pop() + ', ';
                }

                if (content !== '') {
                    _self.$elementjFilestyle.find(':text').val(content.replace(/\, $/g, ''));
                }
            });

            // Check if browser is Firefox
            if (window.navigator.userAgent.search(/firefox/i) > -1) {
                // Simulating choose file for firefox
                this.$elementjFilestyle.find('label').click(function () {
                    _self.$element.click();
                    return false;
                });
            }
        }
    };

    var old = $.fn.jfilestyle;

    $.fn.jfilestyle = function (option, value) {
        var get = '',
            element = this.each(function () {
                if ($(this).attr('type') === 'file') {
                    var $this = $(this),
                        data = $this.data('jfilestyle'),
                        options = $.extend({}, $.fn.jfilestyle.defaults, option, typeof option === 'object' && option);

                    if (!data) {
                        $this.data('jfilestyle', (data = new JFilestyle(this, options)));
                        data.constructor();
                    }

                    if (typeof option === 'string') {
                        get = data[option](value);
                    }
                }
            });

        if (typeof get !== undefined) {
            return get;
        } else {
            return element;
        }
    };

    $.fn.jfilestyle.defaults = {
        'buttonText': 'Choose file',
        'input': true,
        'icon': true,
        'size': '200px',
        'iconName': 'icon-folder-open',
        'theme': ''
    };

    $.fn.jfilestyle.noConflict = function () {
        $.fn.jfilestyle = old;
        return this;
    };

    // Data attributes register
    $('.jfilestyle').each(function () {
        var $this = $(this),
            options = {
                'buttonText': $this.attr('data-buttonText'),
                'input': $this.attr('data-input') === 'false' ? false : true,
                'icon': $this.attr('data-icon') === 'false' ? false : true,
                'size': $this.attr('data-size'),
                'iconName': $this.attr('data-iconName'),
                'theme': $this.attr('data-theme')
            };

        $this.jfilestyle(options);
    });

})(window.jQuery);