;
(function ($) {
    var cardClone,cardObj,article;
    $.fn.aemTransition = function (options) {
        var opts = $.extend({}, $.fn.aemTransition.defaults, options);
        return this.each(function () {
            if (opts.mode!='default') {
                $(this).wrap('<div class="aem-wrapper"></div>')
            }
            $(this).bind(opts.event, function () {
                cardObj = new Card(this,opts);
                if (opts.mode=='default'){
                    article=$(cardObj.article);
                    cardClone = $(this).clone().attr('id', 'cardClone');
                } else if (opts.mode!='default') {
                    article=$(cardObj.target);
                }
                cardObj.makeKeyframes();
                if (opts.mode=='default'){
                    cardObj.aemExpand();
                } else if (opts.mode!='default') {
                    cardObj.fullscreen();
                }
                
                $(cardObj.target).on('aem.expanded', function(e) {
                    if (opts.mode=='default'){
                        $(article).css({'z-index':1000,'opacity':1}).addClass('ani ani-appear');
                    } else if (opts.mode!='default') {
                        $(cardObj.relatedTarget).addClass('aem-fullscreen-wrapper bring-to-front ani ani-appear');
                        $('#cardWrapper').css({
                            'top': '',
                            'width':'',
                            'height':''
                        }).addClass('aem-fullscreen-wrapper').removeClass('ani ani-expand');
                        $(cardObj.target).addClass('vcenter');
                        $(opts.back).fadeIn();
                    }
                });
                $(opts.back).bind('click', function(e) {
                    if (opts.mode=='default'){
                        cardObj.aemContract();
                    } else if (opts.mode!='default') {
                        $(this).fadeOut();
                        if (cardObj.mode=='video'){
                            $(article)[0].pause();
                        }
                        cardObj.exitFullscreen();
                    }
                });
            });
        });
    };

    $.fn.aemTransition.defaults = {
        back: '#backBtn',
        article: null,
        yOffset: 0,
        xOffset: 0,
        mode: 'default',
        event: 'click'
    };


    function Card(myCard,opts) {
        var cords = myCard.getBoundingClientRect();
        var winH = $(window).height();
        var winW = $(window).width();
        var x = cords.left;
        var y = cords.top;
        var w = cords.width;
        var h = cords.height;
        if (opts.mode=='default'){
            if (opts.article != null){
                this.article= opts.article;
            } else {
                this.article= $($(myCard).attr('data-target'));
            }
        }
        this.q = $(myCard).position();
        this.hScale = winH / h;
        this.wScale = winW / w;
        this.xTrans = (winW - w) / 2 - x + opts.xOffset;
        this.yTrans = (winH - h) / 2 - y + opts.yOffset;
        this.xScaleDown = w / winW;
        this.yScaleDown = h / winH;
        this.xTransBack = this.xTrans * -1;
        this.yTransBack = this.yTrans * -1;
        this.w = w;
        this.h = h;
        this.target = myCard;
        this.relatedTarget = $(myCard).parent();
        this.mode= opts.mode;
    }
    
    Card.prototype.makeKeyframes = function () {
        $.keyframe.define([{
            name: 'canvas-expand',
            'to': {
                'transform': 'translate3d(' + this.xTrans + 'px, ' + this.yTrans + 'px,0)scale(' + this.wScale + ',' + this.hScale + ')'
            }
        }]);

        $.keyframe.define([{
            name: 'card-contract',
            'to': {
                'transform': 'translate(' + this.xTransBack + 'px, ' + this.yTransBack + 'px)scale(' + this.xScaleDown + ',' + this.yScaleDown + ')'
            }
        }]);
    }
    
    Card.prototype.aemExpand = function () {
        $(cardObj.target).trigger('aem.expand');
        var cardWrapper = $('<div class="ani ani-expand" id="cardWrapper"></div>').width(this.w).height(this.h).css('top', this.q.top);
        $(cardClone).appendTo(cardWrapper);
        $('body').addClass('article-open');
        $(cardWrapper).insertAfter($(this.target));
        $(this).css('opacity', 0);
        $(cardClone).addClass('ani ani-fade');
        $('#cardWrapper').on('animationend webkitAnimationEnd',function(e){
            if(e.originalEvent.animationName=='canvas-expand'){
                $(cardObj.target).trigger('aem.expanded');
            };
        });
    }
    
    Card.prototype.fullscreen = function () {
        $(article).trigger('aem.expand');
        var cardWrapper = $('<div class="ani ani-expand" id="cardWrapper"></div>').css({
            'top': this.q.top,
            'background':'#000',
            'width':this.w,
            'height':this.h
        });
        $('body').addClass('article-open');
        $(cardWrapper).insertAfter(this.relatedTarget);
        $('#cardWrapper').on('animationend webkitAnimationEnd',function(e){
            if(e.originalEvent.animationName=='canvas-expand'){
                $(article).trigger('aem.expanded');
            };
        });
    }
    
    Card.prototype.aemContract = function () {
        $('#cardWrapper').remove();
        $(this.article).removeClass('ani ani-appear').addClass('ani ani-contract');
        $(this.article).on("webkitAnimationStart animationstart webkitAnimationEnd animationend", function (e) {
            if (e.originalEvent.animationName == 'card-contract' && (e.type == 'animationstart' || e.type == 'webkitAnimationStart')) {
                setTimeout(function () {
                    $(cardClone).removeClass('ani ani-fade');
                    $(cardObj.target).css('opacity', 1);
                    $('body').removeClass('article-open');
                }, 300);
                setTimeout(function () {
                    $(cardObj.article).css({
                        'z-index': -2,
                        'opacity': 0
                    }).removeClass('ani ani-contract');
                }, 320);
            };
                  
//            if (e.type == 'animationend' || e.type == 'webkitAnimationEnd') {
//                console.log(e.originalEvent.animationName);
//            };
        });
    }

Card.prototype.exitFullscreen = function () {
        $(this.relatedTarget).removeClass('ani ani-appear aem-fullscreen-wrapper bring-to-front').addClass('ani ani-fade');
        $('#cardWrapper').addClass('ani ani-exit-fullscreen');
        $(this.relatedTarget).on("webkitAnimationEnd animationend", function (e) {
             if (e.originalEvent.animationName == 'fade-out'){
                 setTimeout(function(){
                     $(cardObj.target).removeClass('vcenter').fadeIn();
                     $(cardObj.relatedTarget).removeClass('ani ani-fade');
                     $('#cardWrapper').fadeOut();
                     setTimeout(function(){
                         $('#cardWrapper').remove();
                     },200);
                 }, 150);

             }
        });
    
    }

})(jQuery);