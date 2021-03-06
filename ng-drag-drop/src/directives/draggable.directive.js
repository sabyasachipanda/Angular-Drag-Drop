"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = require("@angular/core");
var ng_drag_drop_service_1 = require("../services/ng-drag-drop.service");
var dom_helper_1 = require("../shared/dom-helper");
/**
 * Makes an element draggable by adding the draggable html attribute
 */
var Draggable = /** @class */ (function () {
    function Draggable(el, renderer, ng2DragDropService, zone) {
        this.el = el;
        this.renderer = renderer;
        this.ng2DragDropService = ng2DragDropService;
        this.zone = zone;
        /**
         * Currently not used
         */
        this.dragEffect = 'move';
        /**
         * Defines compatible drag drop pairs. Values must match both in draggable and droppable.dropScope.
         */
        this.dragScope = 'default';
        /**
         * The CSS class applied to a draggable element. If a dragHandle is defined then its applied to that handle
         * element only. By default it is used to change the mouse over pointer.
         */
        this.dragHandleClass = 'drag-handle';
        /**
         * CSS class applied on the source draggable element while being dragged.
         */
        this.dragClass = 'drag-border';
        /**
         * CSS class applied on the drag ghost when being dragged.
         */
        this.dragTransitClass = 'drag-transit';
        /**
         * Event fired when Drag is started
         */
        this.onDragStart = new core_1.EventEmitter();
        /**
         * Event fired while the element is being dragged
         */
        this.onDrag = new core_1.EventEmitter();
        /**
         * Event fired when drag ends
         */
        this.onDragEnd = new core_1.EventEmitter();
        /**
         * @private
         * Backing field for the dragEnabled property
         */
        this._dragEnabled = true;
    }
    Object.defineProperty(Draggable.prototype, "dragImage", {
        get: function () {
            return this._dragImage;
        },
        /**
         * The url to image that will be used as custom drag image when the draggable is being dragged.
         */
        set: function (value) {
            this._dragImage = value;
            this.dragImageElement = new Image();
            this.dragImageElement.src = this.dragImage;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Draggable.prototype, "dragEnabled", {
        get: function () {
            return this._dragEnabled;
        },
        /**
         * Defines if drag is enabled. `true` by default.
         */
        set: function (value) {
            this._dragEnabled = value;
            this.applyDragHandleClass();
        },
        enumerable: true,
        configurable: true
    });
    ;
    Draggable.prototype.ngOnInit = function () {
        this.applyDragHandleClass();
    };
    Draggable.prototype.ngOnDestroy = function () {
        this.unbindDragListeners();
    };
    Draggable.prototype.dragStart = function (e) {
        var _this = this;
        if (this.allowDrag()) {
            // This is a kludgy approach to apply CSS to the drag helper element when an image is being dragged. 
            dom_helper_1.DomHelper.addClass(this.el, this.dragTransitClass);
            setTimeout(function () {
                dom_helper_1.DomHelper.addClass(_this.el, _this.dragClass);
                dom_helper_1.DomHelper.removeClass(_this.el, _this.dragTransitClass);
            }, 10);
            this.ng2DragDropService.dragData = this.dragData;
            this.ng2DragDropService.scope = this.dragScope;
            // Firefox requires setData() to be called otherwise the drag does not work.
            // We don't use setData() to transfer data anymore so this is just a dummy call.
            if (e.dataTransfer != null) {
                e.dataTransfer.setData('text', '');
            }
            // Set dragImage
            if (this.dragImage) {
                e.dataTransfer.setDragImage(this.dragImageElement, 0, 0);
            }
            e.stopPropagation();
            this.onDragStart.emit(e);
            this.ng2DragDropService.onDragStart.next();
            this.zone.runOutsideAngular(function () {
                _this.unbindDragListener = _this.renderer.listen(_this.el.nativeElement, 'drag', function (dragEvent) {
                    _this.drag(dragEvent);
                });
            });
        }
        else {
            e.preventDefault();
        }
    };
    Draggable.prototype.drag = function (e) {
        this.onDrag.emit(e);
    };
    Draggable.prototype.dragEnd = function (e) {
        this.unbindDragListeners();
        dom_helper_1.DomHelper.removeClass(this.el, this.dragClass);
        this.ng2DragDropService.onDragEnd.next();
        this.onDragEnd.emit(e);
        e.stopPropagation();
        e.preventDefault();
    };
    Draggable.prototype.mousedown = function (e) {
        this.mouseDownElement = e.target;
    };
    Draggable.prototype.allowDrag = function () {
        if (this.dragHandle) {
            return dom_helper_1.DomHelper.matches(this.mouseDownElement, this.dragHandle) && this.dragEnabled;
        }
        else {
            return this.dragEnabled;
        }
    };
    Draggable.prototype.applyDragHandleClass = function () {
        var dragElement = this.getDragHandleElement();
        if (!dragElement) {
            return;
        }
        if (this.dragEnabled) {
            dom_helper_1.DomHelper.addClass(dragElement, this.dragHandleClass);
        }
        else {
            dom_helper_1.DomHelper.removeClass(this.el, this.dragHandleClass);
        }
    };
    Draggable.prototype.getDragHandleElement = function () {
        var dragElement = this.el;
        if (this.dragHandle) {
            dragElement = this.el.nativeElement.querySelector(this.dragHandle);
        }
        return dragElement;
    };
    Draggable.prototype.unbindDragListeners = function () {
        if (this.unbindDragListener) {
            this.unbindDragListener();
        }
    };
    Draggable.decorators = [
        { type: core_1.Directive, args: [{
                    selector: '[draggable]'
                },] },
    ];
    /** @nocollapse */
    Draggable.ctorParameters = function () { return [
        { type: core_1.ElementRef, },
        { type: core_1.Renderer2, },
        { type: ng_drag_drop_service_1.NgDragDropService, },
        { type: core_1.NgZone, },
    ]; };
    Draggable.propDecorators = {
        'dragData': [{ type: core_1.Input },],
        'dragHandle': [{ type: core_1.Input },],
        'dragEffect': [{ type: core_1.Input },],
        'dragScope': [{ type: core_1.Input },],
        'dragHandleClass': [{ type: core_1.Input },],
        'dragClass': [{ type: core_1.Input },],
        'dragTransitClass': [{ type: core_1.Input },],
        'dragImage': [{ type: core_1.Input },],
        'dragEnabled': [{ type: core_1.HostBinding, args: ['draggable',] }, { type: core_1.Input },],
        'onDragStart': [{ type: core_1.Output },],
        'onDrag': [{ type: core_1.Output },],
        'onDragEnd': [{ type: core_1.Output },],
        'dragStart': [{ type: core_1.HostListener, args: ['dragstart', ['$event'],] },],
        'dragEnd': [{ type: core_1.HostListener, args: ['dragend', ['$event'],] },],
        'mousedown': [{ type: core_1.HostListener, args: ['mousedown', ['$event'],] },],
    };
    return Draggable;
}());
exports.Draggable = Draggable;
//# sourceMappingURL=draggable.directive.js.map