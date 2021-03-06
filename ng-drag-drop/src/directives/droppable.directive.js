"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = require("@angular/core");
var drop_event_model_1 = require("../shared/drop-event.model");
var ng_drag_drop_service_1 = require("../services/ng-drag-drop.service");
var dom_helper_1 = require("../shared/dom-helper");
var Observable_1 = require("rxjs/Observable");
require("rxjs/add/observable/of");
require("rxjs/add/operator/map");
var Droppable = /** @class */ (function () {
    function Droppable(el, renderer, ng2DragDropService, zone) {
        this.el = el;
        this.renderer = renderer;
        this.ng2DragDropService = ng2DragDropService;
        this.zone = zone;
        /**
         *  Event fired when Drag dragged element enters a valid drop target.
         */
        this.onDragEnter = new core_1.EventEmitter();
        /**
         * Event fired when an element is being dragged over a valid drop target
         */
        this.onDragOver = new core_1.EventEmitter();
        /**
         * Event fired when a dragged element leaves a valid drop target.
         */
        this.onDragLeave = new core_1.EventEmitter();
        /**
         * Event fired when an element is dropped on a valid drop target.
         */
        this.onDrop = new core_1.EventEmitter();
        /**
         * CSS class that is applied when a compatible draggable is being dragged over this droppable.
         */
        this.dragOverClass = 'drag-over-border';
        /**
         * CSS class applied on this droppable when a compatible draggable item is being dragged.
         * This can be used to visually show allowed drop zones.
         */
        this.dragHintClass = 'drag-hint-border';
        /**
         * Defines compatible drag drop pairs. Values must match both in draggable and droppable.dropScope.
         */
        this.dropScope = 'default';
        /**
         * @private
         * Backing field for the dropEnabled property
         */
        this._dropEnabled = true;
        /**
         * @private
         * Field for tracking drag state. Helps when
         * drag stop event occurs before the allowDrop()
         * can be calculated (async).
         */
        this._isDragActive = false;
        /**
         * @private
         * Field for tracking if service is subscribed.
         * Avoids creating multiple subscriptions of service.
         */
        this._isServiceActive = false;
    }
    Object.defineProperty(Droppable.prototype, "dropEnabled", {
        get: function () {
            return this._dropEnabled;
        },
        /**
         * Defines if drop is enabled. `true` by default.
         */
        set: function (value) {
            this._dropEnabled = value;
            if (this._dropEnabled === true) {
                this.subscribeService();
            }
            else {
                this.unsubscribeService();
            }
        },
        enumerable: true,
        configurable: true
    });
    ;
    Droppable.prototype.ngOnInit = function () {
        if (this.dropEnabled === true) {
            this.subscribeService();
        }
    };
    Droppable.prototype.ngOnDestroy = function () {
        this.unsubscribeService();
        this.unbindDragListeners();
    };
    Droppable.prototype.dragEnter = function (e) {
        e.preventDefault();
        e.stopPropagation();
        this.onDragEnter.emit(e);
    };
    Droppable.prototype.dragOver = function (e, result) {
        if (result) {
            dom_helper_1.DomHelper.addClass(this.el, this.dragOverClass);
            e.preventDefault();
            this.onDragOver.emit(e);
        }
    };
    Droppable.prototype.dragLeave = function (e) {
        dom_helper_1.DomHelper.removeClass(this.el, this.dragOverClass);
        e.preventDefault();
        this.onDragLeave.emit(e);
    };
    Droppable.prototype.drop = function (e) {
        dom_helper_1.DomHelper.removeClass(this.el, this.dragOverClass);
        e.preventDefault();
        e.stopPropagation();
        this.ng2DragDropService.onDragEnd.next();
        this.onDrop.emit(new drop_event_model_1.DropEvent(e, this.ng2DragDropService.dragData));
        this.ng2DragDropService.dragData = null;
        this.ng2DragDropService.scope = null;
    };
    Droppable.prototype.allowDrop = function () {
        var _this = this;
        var allowed = false;
        /* tslint:disable:curly */
        /* tslint:disable:one-line */
        if (typeof this.dropScope === 'string') {
            if (typeof this.ng2DragDropService.scope === 'string')
                allowed = this.ng2DragDropService.scope === this.dropScope;
            else if (this.ng2DragDropService.scope instanceof Array)
                allowed = this.ng2DragDropService.scope.indexOf(this.dropScope) > -1;
        }
        else if (this.dropScope instanceof Array) {
            if (typeof this.ng2DragDropService.scope === 'string')
                allowed = this.dropScope.indexOf(this.ng2DragDropService.scope) > -1;
            else if (this.ng2DragDropService.scope instanceof Array)
                allowed = this.dropScope.filter(function (item) {
                    return _this.ng2DragDropService.scope.indexOf(item) !== -1;
                }).length > 0;
        }
        else if (typeof this.dropScope === 'function') {
            allowed = this.dropScope(this.ng2DragDropService.dragData);
            if (allowed instanceof Observable_1.Observable) {
                return allowed.map(function (result) { return result && _this.dropEnabled; });
            }
        }
        /* tslint:enable:curly */
        /* tslint:disable:one-line */
        return Observable_1.Observable.of(allowed && this.dropEnabled);
    };
    Droppable.prototype.subscribeService = function () {
        var _this = this;
        if (this._isServiceActive === true) {
            return;
        }
        this._isServiceActive = true;
        this.dragStartSubscription = this.ng2DragDropService.onDragStart.subscribe(function () {
            _this._isDragActive = true;
            _this.allowDrop().subscribe(function (result) {
                if (result && _this._isDragActive) {
                    dom_helper_1.DomHelper.addClass(_this.el, _this.dragHintClass);
                    _this.zone.runOutsideAngular(function () {
                        _this.unbindDragEnterListener = _this.renderer.listen(_this.el.nativeElement, 'dragenter', function (dragEvent) {
                            _this.dragEnter(dragEvent);
                        });
                        _this.unbindDragOverListener = _this.renderer.listen(_this.el.nativeElement, 'dragover', function (dragEvent) {
                            _this.dragOver(dragEvent, result);
                        });
                        _this.unbindDragLeaveListener = _this.renderer.listen(_this.el.nativeElement, 'dragleave', function (dragEvent) {
                            _this.dragLeave(dragEvent);
                        });
                    });
                }
            });
        });
        this.dragEndSubscription = this.ng2DragDropService.onDragEnd.subscribe(function () {
            _this._isDragActive = false;
            dom_helper_1.DomHelper.removeClass(_this.el, _this.dragHintClass);
            _this.unbindDragListeners();
        });
    };
    Droppable.prototype.unsubscribeService = function () {
        this._isServiceActive = false;
        if (this.dragStartSubscription) {
            this.dragStartSubscription.unsubscribe();
        }
        if (this.dragEndSubscription) {
            this.dragEndSubscription.unsubscribe();
        }
    };
    Droppable.prototype.unbindDragListeners = function () {
        if (this.unbindDragEnterListener) {
            this.unbindDragEnterListener();
        }
        if (this.unbindDragOverListener) {
            this.unbindDragOverListener();
        }
        if (this.unbindDragLeaveListener) {
            this.unbindDragLeaveListener();
        }
    };
    Droppable.decorators = [
        { type: core_1.Directive, args: [{
                    selector: '[droppable]'
                },] },
    ];
    /** @nocollapse */
    Droppable.ctorParameters = function () { return [
        { type: core_1.ElementRef, },
        { type: core_1.Renderer2, },
        { type: ng_drag_drop_service_1.NgDragDropService, },
        { type: core_1.NgZone, },
    ]; };
    Droppable.propDecorators = {
        'onDragEnter': [{ type: core_1.Output },],
        'onDragOver': [{ type: core_1.Output },],
        'onDragLeave': [{ type: core_1.Output },],
        'onDrop': [{ type: core_1.Output },],
        'dragOverClass': [{ type: core_1.Input },],
        'dragHintClass': [{ type: core_1.Input },],
        'dropScope': [{ type: core_1.Input },],
        'dropEnabled': [{ type: core_1.Input },],
        'drop': [{ type: core_1.HostListener, args: ['drop', ['$event'],] },],
    };
    return Droppable;
}());
exports.Droppable = Droppable;
//# sourceMappingURL=droppable.directive.js.map