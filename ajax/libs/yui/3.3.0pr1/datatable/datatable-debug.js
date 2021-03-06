YUI.add('datatable-base', function(Y) {

var YLang = Y.Lang,
    Ysubstitute = Y.Lang.substitute,
    YNode = Y.Node,
    Ycreate = YNode.create,
    YgetClassName = Y.ClassNameManager.getClassName,

    DATATABLE = "datatable",
    COLUMN = "column",
    
    FOCUS = "focus",
    KEYDOWN = "keydown",
    MOUSEENTER = "mouseenter",
    MOUSELEAVE = "mouseleave",
    MOUSEUP = "mouseup",
    MOUSEDOWN = "mousedown",
    CLICK = "click",
    DOUBLECLICK = "doubleclick",

    CLASS_COLUMNS = YgetClassName(DATATABLE, "columns"),
    CLASS_DATA = YgetClassName(DATATABLE, "data"),
    CLASS_MSG = YgetClassName(DATATABLE, "msg"),
    CLASS_LINER = YgetClassName(DATATABLE, "liner"),
    CLASS_FIRST = YgetClassName(DATATABLE, "first"),
    CLASS_LAST = YgetClassName(DATATABLE, "last"),
    CLASS_EVEN = YgetClassName(DATATABLE, "even"),
    CLASS_ODD = YgetClassName(DATATABLE, "odd"),

    TEMPLATE_TABLE = '<table></table>',
    TEMPLATE_COL = '<col></col>',
    TEMPLATE_THEAD = '<thead class="'+CLASS_COLUMNS+'"></thead>',
    TEMPLATE_TBODY = '<tbody class="'+CLASS_DATA+'"></tbody>',
    TEMPLATE_TH = '<th id="{id}" rowspan="{rowspan}" colspan="{colspan}" class="{classnames}"><div class="'+CLASS_LINER+'">{value}</div></th>',
    TEMPLATE_TR = '<tr id="{id}"></tr>',
    TEMPLATE_TD = '<td headers="{headers}" class="{classnames}"><div class="'+CLASS_LINER+'">{value}</div></td>',
    TEMPLATE_VALUE = '{value}',
    TEMPLATE_MSG = '<tbody class="'+CLASS_MSG+'"></tbody>';
    


/**
 * The Column class defines and manages attributes of Columns for DataTable.
 *
 * @class Column
 * @extends Widget
 * @constructor
 */
function Column(config) {
    Column.superclass.constructor.apply(this, arguments);
}

/////////////////////////////////////////////////////////////////////////////
//
// STATIC PROPERTIES
//
/////////////////////////////////////////////////////////////////////////////
Y.mix(Column, {
    /**
     * Class name.
     *
     * @property NAME
     * @type String
     * @static
     * @final
     * @value "column"
     */
    NAME: "column",

/////////////////////////////////////////////////////////////////////////////
//
// ATTRIBUTES
//
/////////////////////////////////////////////////////////////////////////////
    ATTRS: {
        id: {
            valueFn: "_defaultId",
            writeOnce: true
        },
        key: {
            valueFn: "_defaultKey"
        },
        field: {
            valueFn: "_defaultField"
        },
        label: {
            valueFn: "_defaultLabel"
        },
        keyIndex: {
            readOnly: true
        },
        parent: {
            readOnly: true
        },
        children: {
        },
        colSpan: {
            readOnly: true
        },
        rowSpan: {
            readOnly: true
        },
        thNode: {
            readOnly: true
        },
        thLinerNode: {
            readOnly: true
        },
        thLabelNode: {
            readOnly: true
        },
        abbr: {
            value: null
        },
        headers: {}, // set by Columnset code
        classnames: {
            readOnly: true,
            getter: "_getClassnames"
        },
        editor: {},
        formatter: {},

        // requires datatable-colresize
        resizeable: {},

        //requires datatable-sort
        sortable: {},
        hidden: {},
        width: {},
        minWidth: {},
        maxAutoWidth: {}
    }
});

/////////////////////////////////////////////////////////////////////////////
//
// PROTOTYPE
//
/////////////////////////////////////////////////////////////////////////////
Y.extend(Column, Y.Widget, {
    /////////////////////////////////////////////////////////////////////////////
    //
    // ATTRIBUTE HELPERS
    //
    /////////////////////////////////////////////////////////////////////////////
    /**
    * @method _defaultId
    * @description Return ID for instance.
    * @returns String
    * @private
    */
    _defaultId: function() {
        return Y.guid();
    },

    /**
    * @method _defaultKey
    * @description Return key for instance. Defaults to ID if one was not
    * provided.
    * @returns String
    * @private
    */
    _defaultKey: function(key) {
        return key || Y.guid();
    },

    /**
    * @method _defaultField
    * @description Return field for instance. Defaults to key if one was not
    * provided.
    * @returns String
    * @private
    */
    _defaultField: function(field) {
        return field || this.get("key");
    },

    /**
    * @method _defaultLabel
    * @description Return label for instance. Defaults to key if one was not
    * provided.
    * @returns String
    * @private
    */
    _defaultLabel: function(label) {
        return label || this.get("key");
    },

    /**
     * Updates the UI if changes are made to abbr.
     *
     * @method _afterAbbrChange
     * @param e {Event} Custom event for the attribute change.
     * @private
     */
    _afterAbbrChange: function (e) {
        this._uiSetAbbr(e.newVal);
    },

    /////////////////////////////////////////////////////////////////////////////
    //
    // METHODS
    //
    /////////////////////////////////////////////////////////////////////////////
    /**
    * Initializer.
    *
    * @method initializer
    * @param config {Object} Config object.
    * @private
    */
    initializer: function(config) {
    },

    /**
    * Destructor.
    *
    * @method destructor
    * @private
    */
    destructor: function() {
    },

    /**
     * Returns classnames for Column.
     *
     * @method _getClassnames
     * @private
     */
    _getClassnames: function () {
        return Y.ClassNameManager.getClassName(COLUMN, this.get("id"));
        /*var allClasses;

        // Add CSS classes
        if(lang.isString(oColumn.className)) {
            // Single custom class
            allClasses = [oColumn.className];
        }
        else if(lang.isArray(oColumn.className)) {
            // Array of custom classes
            allClasses = oColumn.className;
        }
        else {
            // no custom classes
            allClasses = [];
        }

        // Hook for setting width with via dynamic style uses key since ID is too disposable
        allClasses[allClasses.length] = this.getId() + "-col-" +oColumn.getSanitizedKey();

        // Column key - minus any chars other than "A-Z", "a-z", "0-9", "_", "-", ".", or ":"
        allClasses[allClasses.length] = "yui-dt-col-" +oColumn.getSanitizedKey();

        var isSortedBy = this.get("sortedBy") || {};
        // Sorted
        if(oColumn.key === isSortedBy.key) {
            allClasses[allClasses.length] = isSortedBy.dir || '';
        }
        // Hidden
        if(oColumn.hidden) {
            allClasses[allClasses.length] = DT.CLASS_HIDDEN;
        }
        // Selected
        if(oColumn.selected) {
            allClasses[allClasses.length] = DT.CLASS_SELECTED;
        }
        // Sortable
        if(oColumn.sortable) {
            allClasses[allClasses.length] = DT.CLASS_SORTABLE;
        }
        // Resizeable
        if(oColumn.resizeable) {
            allClasses[allClasses.length] = DT.CLASS_RESIZEABLE;
        }
        // Editable
        if(oColumn.editor) {
            allClasses[allClasses.length] = DT.CLASS_EDITABLE;
        }

        // Addtnl classes, including First/Last
        if(aAddClasses) {
            allClasses = allClasses.concat(aAddClasses);
        }

        return allClasses.join(' ');*/
    },

    ////////////////////////////////////////////////////////////////////////////
    //
    // SYNC
    //
    ////////////////////////////////////////////////////////////////////////////
    /**
    * Syncs UI to intial state.
    *
    * @method syncUI
    * @private
    */
    syncUI: function() {
        this._uiSetAbbr(this.get("abbr"));
    },

    /**
     * Updates abbr.
     *
     * @method _uiSetAbbr
     * @param val {String} New abbr.
     * @protected
     */
    _uiSetAbbr: function(val) {
        this._thNode.set("abbr", val);
    }
});

Y.Column = Column;
/**
 * The Columnset class defines and manages a collection of Columns.
 *
 * @class Columnset
 * @extends Base
 * @constructor
 */
function Columnset(config) {
    Columnset.superclass.constructor.apply(this, arguments);
}

/////////////////////////////////////////////////////////////////////////////
//
// STATIC PROPERTIES
//
/////////////////////////////////////////////////////////////////////////////
Y.mix(Columnset, {
    /**
     * Class name.
     *
     * @property NAME
     * @type String
     * @static
     * @final
     * @value "columnset"
     */
    NAME: "columnset",

    /////////////////////////////////////////////////////////////////////////////
    //
    // ATTRIBUTES
    //
    /////////////////////////////////////////////////////////////////////////////
    ATTRS: {
        definitions: {
            setter: "_setDefinitions"
        },

        // DOM tree representation of all Columns
        tree: {
            readOnly: true,
            value: []
        },

        //TODO: is this necessary?
        // Flat representation of all Columns
        flat: {
            readOnly: true,
            value: []
        },

        // Hash of all Columns by ID
        hash: {
            readOnly: true,
            value: {}
        },

        // Flat representation of only Columns that are meant to display data
        keys: {
            readOnly: true,
            value: []
        }
    }
});

/////////////////////////////////////////////////////////////////////////////
//
// PROTOTYPE
//
/////////////////////////////////////////////////////////////////////////////
Y.extend(Columnset, Y.Base, {
    /////////////////////////////////////////////////////////////////////////////
    //
    // ATTRIBUTE HELPERS
    //
    /////////////////////////////////////////////////////////////////////////////
    /**
    * @method _setDefinitions
    * @description Clones definitions before setting.
    * @param definitions {Array} Array of column definitions.
    * @returns Array
    * @private
    */
    _setDefinitions: function(definitions) {
            return Y.clone(definitions);
    },

    /////////////////////////////////////////////////////////////////////////////
    //
    // METHODS
    //
    /////////////////////////////////////////////////////////////////////////////
    /**
    * Initializer. Generates all internal representations of the collection of
    * Columns.
    *
    * @method initializer
    * @param config {Object} Config object.
    * @private
    */
    initializer: function() {

        // DOM tree representation of all Columns
        var tree = [],
        // Flat representation of all Columns
        flat = [],
        // Hash of all Columns by ID
        hash = {},
        // Flat representation of only Columns that are meant to display data
        keys = [],
        // Original definitions
        definitions = this.get("definitions"),

        self = this;

        // Internal recursive function to define Column instances
        function parseColumns(depth, currentDefinitions, parent) {
            var i=0,
                len = currentDefinitions.length,
                currentDefinition,
                column,
                currentChildren;

            // One level down
            depth++;

            // Create corresponding dom node if not already there for this depth
            if(!tree[depth]) {
                tree[depth] = [];
            }

            // Parse each node at this depth for attributes and any children
            for(; i<len; ++i) {
                currentDefinition = currentDefinitions[i];

                currentDefinition = YLang.isString(currentDefinition) ? {key:currentDefinition} : currentDefinition;

                // Instantiate a new Column for each node
                column = new Y.Column(currentDefinition);

                // Cross-reference Column ID back to the original object literal definition
                currentDefinition.yuiColumnId = column.get("id");

                // Add the new Column to the flat list
                flat.push(column);

                // Add the new Column to the hash
                hash[column.get("id")] = column;

                // Assign its parent as an attribute, if applicable
                if(parent) {
                    column._set("parent", parent);
                }

                // The Column has descendants
                if(YLang.isArray(currentDefinition.children)) {
                    currentChildren = currentDefinition.children;
                    column._set("children", currentChildren);

                    self._setColSpans(column, currentDefinition);

                    self._cascadePropertiesToChildren(column, currentChildren);

                    // The children themselves must also be parsed for Column instances
                    if(!tree[depth+1]) {
                        tree[depth+1] = [];
                    }
                    parseColumns(depth, currentChildren, column);
                }
                // This Column does not have any children
                else {
                    column._set("keyIndex", keys.length);
                    column._set("colSpan", 1);
                    keys.push(column);
                }

                // Add the Column to the top-down dom tree
                tree[depth].push(column);
            }
            depth--;
        }

        // Parse out Column instances from the array of object literals
        parseColumns(-1, definitions);


        // Save to the Columnset instance
        this._set("tree", tree);
        this._set("flat", flat);
        this._set("hash", hash);
        this._set("keys", keys);

        this._setRowSpans();
        this._setHeaders();
    },

    /**
    * Destructor.
    *
    * @method destructor
    * @private
    */
    destructor: function() {
    },

    /////////////////////////////////////////////////////////////////////////////
    //
    // COLUMN HELPERS
    //
    /////////////////////////////////////////////////////////////////////////////
    /**
    * Cascade certain properties to children if not defined on their own.
    *
    * @method _cascadePropertiesToChildren
    * @private
    */
    _cascadePropertiesToChildren: function(column, currentChildren) {
        //TODO: this is all a giant todo
        var i = 0,
            len = currentChildren.length,
            child;

        // Cascade certain properties to children if not defined on their own
        for(; i<len; ++i) {
            child = currentChildren[i];
            if(column.get("className") && (child.className === undefined)) {
                child.className = column.get("className");
            }
            if(column.get("editor") && (child.editor === undefined)) {
                child.editor = column.get("editor");
            }
            if(column.get("formatter") && (child.formatter === undefined)) {
                child.formatter = column.get("formatter");
            }
            if(column.get("resizeable") && (child.resizeable === undefined)) {
                child.resizeable = column.get("resizeable");
            }
            if(column.get("sortable") && (child.sortable === undefined)) {
                child.sortable = column.get("sortable");
            }
            if(column.get("hidden")) {
                child.hidden = true;
            }
            if(column.get("width") && (child.width === undefined)) {
                child.width = column.get("width");
            }
            if(column.get("minWidth") && (child.minWidth === undefined)) {
                child.minWidth = column.get("minWidth");
            }
            if(column.get("maxAutoWidth") && (child.maxAutoWidth === undefined)) {
                child.maxAutoWidth = column.get("maxAutoWidth");
            }
        }
    },

    /**
    * @method _setColSpans
    * @description Calculates and sets colSpan attribute on given Column.
    * @param column {Array} Column instance.
    * @param definition {Object} Column definition.
    * @private
    */
    _setColSpans: function(column, definition) {
        // Determine COLSPAN value for this Column
        var terminalChildNodes = 0;

        function countTerminalChildNodes(ancestor) {
            var descendants = ancestor.children,
                i = 0,
                len = descendants.length;

            // Drill down each branch and count terminal nodes
            for(; i<len; ++i) {
                // Keep drilling down
                if(YLang.isArray(descendants[i].children)) {
                    countTerminalChildNodes(descendants[i]);
                }
                // Reached branch terminus
                else {
                    terminalChildNodes++;
                }
            }
        }
        countTerminalChildNodes(definition);
        column._set("colSpan", terminalChildNodes);
    },

    /**
    * @method _setRowSpans
    * @description Calculates and sets rowSpan attribute on all Columns.
    * @private
    */
    _setRowSpans: function() {
        // Determine ROWSPAN value for each Column in the DOM tree
        function parseDomTreeForRowSpan(tree) {
            var maxRowDepth = 1,
                currentRow,
                currentColumn,
                m,p;

            // Calculate the max depth of descendants for this row
            function countMaxRowDepth(row, tmpRowDepth) {
                tmpRowDepth = tmpRowDepth || 1;

                var i = 0,
                    len = row.length,
                    col;

                for(; i<len; ++i) {
                    col = row[i];
                    // Column has children, so keep counting
                    if(YLang.isArray(col.children)) {
                        tmpRowDepth++;
                        countMaxRowDepth(col.children, tmpRowDepth);
                        tmpRowDepth--;
                    }
                    // Column has children, so keep counting
                    else if(col.get && YLang.isArray(col.get("children"))) {
                        tmpRowDepth++;
                        countMaxRowDepth(col.get("children"), tmpRowDepth);
                        tmpRowDepth--;
                    }
                    // No children, is it the max depth?
                    else {
                        if(tmpRowDepth > maxRowDepth) {
                            maxRowDepth = tmpRowDepth;
                        }
                    }
                }
            }

            // Count max row depth for each row
            for(m=0; m<tree.length; m++) {
                currentRow = tree[m];
                countMaxRowDepth(currentRow);

                // Assign the right ROWSPAN values to each Column in the row
                for(p=0; p<currentRow.length; p++) {
                    currentColumn = currentRow[p];
                    if(!YLang.isArray(currentColumn.get("children"))) {
                        currentColumn._set("rowSpan", maxRowDepth);
                    }
                    else {
                        currentColumn._set("rowSpan", 1);
                    }
                }

                // Reset counter for next row
                maxRowDepth = 1;
            }
        }
        parseDomTreeForRowSpan(this.get("tree"));
    },

    /**
    * @method _setHeaders
    * @description Calculates and sets headers attribute on all Columns.
    * @private
    */
    _setHeaders: function() {
        var headers, column,
            allKeys = this.get("keys"),
            i=0, len = allKeys.length;

        function recurseAncestorsForHeaders(headers, column) {
            headers.push(column.get("key"));
            //headers[i].push(column.getSanitizedKey());
            if(column.get("parent")) {
                recurseAncestorsForHeaders(headers, column.get("parent"));
            }
        }
        for(; i<len; ++i) {
            headers = [];
            column = allKeys[i];
            recurseAncestorsForHeaders(headers, column);
            column._set("headers", headers.reverse().join(" "));
        }
    },

    getColumn: function() {
    }
});

Y.Columnset = Columnset;
/**
 * The DataTable widget provides a progressively enhanced DHTML control for
 * displaying tabular data across A-grade browsers.
 *
 * @module datatable
 */

/**
 * Provides the base DataTable implementation, which can be extended to add
 * additional functionality, such as sorting or scrolling.
 *
 * @module datatable
 * @submodule datatable-base
 */

/**
 * Base class for the DataTable widget.
 * @class DataSource.Base
 * @extends Widget
 * @constructor
 */
function DTBase(config) {
    DTBase.superclass.constructor.apply(this, arguments);
}

/////////////////////////////////////////////////////////////////////////////
//
// STATIC PROPERTIES
//
/////////////////////////////////////////////////////////////////////////////
Y.mix(DTBase, {

    /**
     * Class name.
     *
     * @property NAME
     * @type String
     * @static
     * @final
     * @value "dataTable"
     */
    NAME:  "dataTable",

/////////////////////////////////////////////////////////////////////////////
//
// ATTRIBUTES
//
/////////////////////////////////////////////////////////////////////////////
    ATTRS: {
        /**
        * @attribute columnset
        * @description Pointer to Columnset instance.
        * @type Array | Y.Columnset
        */
        columnset: {
            setter: "_setColumnset"
        },

        /**
        * @attribute recordset
        * @description Pointer to Recordset instance.
        * @type Array | Y.Recordset
        */
        recordset: {
            setter: "_setRecordset"
        },

        /*TODO
        * @attribute state
        * @description Internal state.
        * @readonly
        * @type
        */
        /*state: {
            value: new Y.State(),
            readOnly: true

        },*/

        /**
        * @attribute strings
        * @description The collection of localizable strings used to label
        * elements of the UI.
        * @type Object
        */
        strings: {
            valueFn: function() {
                return Y.Intl.get("datatable-base");
            }
        },

        /**
        * @attribute thValueTemplate
        * @description Tokenized markup template for TH value.
        * @type String
        * @default '{value}'
        */
        thValueTemplate: {
            value: TEMPLATE_VALUE
        },

        /**
        * @attribute tdValueTemplate
        * @description Tokenized markup template for TD value.
        * @type String
        * @default '{value}'
        */
        tdValueTemplate: {
            value: TEMPLATE_VALUE
        },

        /**
        * @attribute trTemplate
        * @description Tokenized markup template for TR node creation.
        * @type String
        * @default '<tr id="{id}"></tr>'
        */
        trTemplate: {
            value: TEMPLATE_TR
        }
    },

/////////////////////////////////////////////////////////////////////////////
//
// TODO: HTML_PARSER
//
/////////////////////////////////////////////////////////////////////////////
    HTML_PARSER: {
        /*caption: function (srcNode) {
            
        }*/
    }
});

/////////////////////////////////////////////////////////////////////////////
//
// PROTOTYPE
//
/////////////////////////////////////////////////////////////////////////////
Y.extend(DTBase, Y.Widget, {
    /**
    * @property thTemplate
    * @description Tokenized markup template for TH node creation.
    * @type String
    * @default '<th id="{id}" rowspan="{rowspan}" colspan="{colspan}"><div class="'+CLASS_LINER+'">{value}</div></th>'
    */
    thTemplate: TEMPLATE_TH,

    /**
    * @property tdTemplate
    * @description Tokenized markup template for TD node creation.
    * @type String
    * @default '<td headers="{headers}"><div class="'+CLASS_LINER+'">{value}</div></td>'
    */
    tdTemplate: TEMPLATE_TD,
    
    /**
    * @property _theadNode
    * @description Pointer to THEAD node.
    * @type Y.Node
    * @private
    */
    _theadNode: null,
    
    /**
    * @property _tbodyNode
    * @description Pointer to TBODY node.
    * @type Y.Node
    * @private
    */
    _tbodyNode: null,
    
    /**
    * @property _msgNode
    * @description Pointer to message display node.
    * @type Y.Node
    * @private
    */
    _msgNode: null,

    /////////////////////////////////////////////////////////////////////////////
    //
    // ATTRIBUTE HELPERS
    //
    /////////////////////////////////////////////////////////////////////////////
    /**
     * Updates the UI if changes are made to any of the strings in the strings
     * attribute.
     *
     * @method _afterStringsChange
     * @param e {Event} Custom event for the attribute change.
     * @protected
     */
    _afterStringsChange: function (e) {
        this._uiSetStrings(e.newVal);
    },

    /**
    * @method _setColumnset
    * @description Converts Array to Y.Columnset.
    * @param columns {Array | Y.Columnset}
    * @returns Y.Columnset
    * @private
    */
    _setColumnset: function(columns) {
        return YLang.isArray(columns) ? new Y.Columnset({definitions:columns}) : columns;
    },

    /**
     * Updates the UI if changes are made to Columnset.
     *
     * @method _afterColumnsetChange
     * @param e {Event} Custom event for the attribute change.
     * @private
     */
    _afterColumnsetChange: function (e) {
        this._uiSetColumnset(e.newVal);
    },

    /**
    * @method _setRecordset
    * @description Converts Array to Y.Recordset.
    * @param records {Array | Y.Recordset}
    * @returns Y.Recordset
    * @private
    */
    _setRecordset: function(rs) {
        if(YLang.isArray(rs)) {
            rs = new Y.Recordset({records:rs});
        }

        rs.addTarget(this);
        return rs;
    },

    /**
    * @method _afterRecordsetChange
    * @description Adds bubble target.
    * @param records {Array | Y.Recordset}
    * @returns Y.Recordset
    * @private
    */
    _afterRecordsetChange: function (e) {
        this._uiSetRecordset(e.newVal);
    },

    /////////////////////////////////////////////////////////////////////////////
    //
    // METHODS
    //
    /////////////////////////////////////////////////////////////////////////////
    /**
    * Initializer.
    *
    * @method initializer
    * @param config {Object} Config object.
    * @private
    */
    initializer: function(config) {
    },

    /**
    * Destructor.
    *
    * @method destructor
    * @private
    */
    destructor: function() {
         this.get("recordset").removeTarget(this);
    },

    ////////////////////////////////////////////////////////////////////////////
    //
    // RENDER
    //
    ////////////////////////////////////////////////////////////////////////////

    /**
    * Renders UI.
    *
    * @method renderUI
    * @private
    */
    renderUI: function() {
        // TABLE
        return (this._addTableNode(this.get("contentBox")) &&
        // COLGROUP
        this._addColgroupNode(this._tableNode) &&
        // THEAD
        this._addTheadNode(this._tableNode) &&
        // Primary TBODY
        this._addTbodyNode(this._tableNode) &&
        // Message TBODY
        this._addMessageNode(this._tableNode) &&
        // CAPTION
        this._addCaptionNode(this._tableNode));
   },

    /**
    * Creates and attaches TABLE element to given container.
    *
    * @method _addTableNode
    * @param containerNode {Y.Node} Parent node.
    * @protected
    * @returns Y.Node
    */
    _addTableNode: function(containerNode) {
        if (!this._tableNode) {
            this._tableNode = containerNode.appendChild(Ycreate(TEMPLATE_TABLE));
        }
        return this._tableNode;
    },

    /**
    * Creates and attaches COLGROUP element to given TABLE.
    *
    * @method _addColgroupNode
    * @param tableNode {Y.Node} Parent node.
    * @protected
    * @returns Y.Node
    */
    _addColgroupNode: function(tableNode) {
        // Add COLs to DOCUMENT FRAGMENT
        var len = this.get("columnset").get("keys").length,
            i = 0,
            allCols = ["<colgroup>"];

        for(; i<len; ++i) {
            allCols.push(TEMPLATE_COL);
        }

        allCols.push("</colgroup>");

        // Create COLGROUP
        this._colgroupNode = tableNode.insertBefore(Ycreate(allCols.join("")), tableNode.get("firstChild"));

        return this._colgroupNode;
    },

    /**
    * Creates and attaches THEAD element to given container.
    *
    * @method _addTheadNode
    * @param tableNode {Y.Node} Parent node.
    * @protected
    * @returns Y.Node
    */
    _addTheadNode: function(tableNode) {
        if(tableNode) {
            this._theadNode = tableNode.insertBefore(Ycreate(TEMPLATE_THEAD), this._colgroupNode.next());
            return this._theadNode;
        }
    },

    /**
    * Creates and attaches TBODY element to given container.
    *
    * @method _addTbodyNode
    * @param tableNode {Y.Node} Parent node.
    * @protected
    * @returns Y.Node
    */
    _addTbodyNode: function(tableNode) {
        this._tbodyNode = tableNode.appendChild(Ycreate(TEMPLATE_TBODY));
        return this._tbodyNode;
    },

    /**
    * Creates and attaches message display element to given container.
    *
    * @method _addMessageNode
    * @param tableNode {Y.Node} Parent node.
    * @protected
    * @returns Y.Node
    */
    _addMessageNode: function(tableNode) {
        this._msgNode = tableNode.insertBefore(Ycreate(TEMPLATE_MSG), this._tbodyNode);
        return this._msgNode;
    },

    /**
    * Creates and attaches CAPTION element to given container.
    *
    * @method _addCaptionNode
    * @param tableNode {Y.Node} Parent node.
    * @protected
    * @returns Y.Node
    */
    _addCaptionNode: function(tableNode) {
        //TODO: node.createCaption
        this._captionNode = tableNode.invoke("createCaption");
        return this._captionNode;
    },

    ////////////////////////////////////////////////////////////////////////////
    //
    // BIND
    //
    ////////////////////////////////////////////////////////////////////////////

    /**
    * Binds events.
    *
    * @method bindUI
    * @private
    */
    bindUI: function() {
        var tableNode = this._tableNode,
            contentBox = this.get("contentBox"),
            theadFilter = "thead."+CLASS_COLUMNS+">tr>th",
            tbodyFilter ="tbody."+CLASS_DATA+">tr>td",
            msgFilter = "tbody."+CLASS_MSG+">tr>td";
            
        // Define custom events that wrap DOM events. Simply pass through DOM
        // event facades.
        //TODO: do we need queuable=true?
        //TODO: All the other events.
        /**
         * Fired when a TH element has a click.
         *
         * @event theadCellClick
         */
        this.publish("theadCellClick", {defaultFn: this._defTheadCellClickFn, emitFacade:false, queuable:true});
        /**
         * Fired when a THEAD>TR element has a click.
         *
         * @event theadRowClick
         */
        this.publish("theadRowClick", {defaultFn: this._defTheadRowClickFn, emitFacade:false, queuable:true});
        /**
         * Fired when the THEAD element has a click.
         *
         * @event theadClick
         */
        this.publish("theadClick", {defaultFn: this._defTheadClickFn, emitFacade:false, queuable:true});
        /**
         * Fired when a TH element has a mouseenter.
         *
         * @event theadCellMouseenter
         */
        this.publish("theadCellMouseenter", {defaultFn: this._defTheadCellMouseenterFn, emitFacade:false, queuable:true});
        /**
         * Fired when a THEAD>TR element has a mouseenter.
         *
         * @event theadRowMouseenter
         */
        this.publish("theadRowMouseenter", {defaultFn: this._defTheadRowMouseenterFn, emitFacade:false, queuable:true});
        /**
         * Fired when the THEAD element has a mouseenter.
         *
         * @event theadMouseenter
         */
        this.publish("theadMouseenter", {defaultFn: this._defTheadMouseenterFn, emitFacade:false, queuable:true});
        /**
         * Fired when a TD element has a click.
         *
         * @event tbodyCellClick
         */
        this.publish("tbodyCellClick", {defaultFn: this._defTbodyCellClickFn, emitFacade:false, queuable:true});
        /**
         * Fired when a TBODY>TR element has a click.
         *
         * @event tbodyRowClick
         */
        this.publish("tbodyRowClick", {defaultFn: this._defTbodyRowClickFn, emitFacade:false, queuable:true});
        /**
         * Fired when the TBODY element has a click.
         *
         * @event tbodyClick
         */
        this.publish("tbodyClick", {defaultFn: this._defTbodyClickFn, emitFacade:false, queuable:true});

        // Bind to THEAD DOM events
        tableNode.delegate(FOCUS, this._onDomEvent, theadFilter, this, "theadCellFocus");
        tableNode.delegate(KEYDOWN, this._onDomEvent, theadFilter, this, "theadCellKeydown");
        tableNode.delegate(MOUSEENTER, this._onDomEvent, theadFilter, this, "theadCellMouseenter");
        tableNode.delegate(MOUSELEAVE, this._onDomEvent, theadFilter, this, "theadCellMouseleave");
        tableNode.delegate(MOUSEUP, this._onDomEvent, theadFilter, this, "theadCellMouseup");
        tableNode.delegate(MOUSEDOWN, this._onDomEvent, theadFilter, this, "theadCellMousedown");
        tableNode.delegate(CLICK, this._onDomEvent, theadFilter, this, "theadCellClick");
        // Since we can't listen for click and dblclick on the same element...
        contentBox.delegate(DOUBLECLICK, this._onEvent, theadFilter, this, "theadCellDoubleclick");

        // Bind to TBODY DOM events
        tableNode.delegate(FOCUS, this._onDomEvent, tbodyFilter, this, "tbodyCellFocus");
        tableNode.delegate(KEYDOWN, this._onDomEvent, tbodyFilter, this, "tbodyCellKeydown");
        tableNode.delegate(MOUSEENTER, this._onDomEvent, tbodyFilter, this, "tbodyCellMouseenter");
        tableNode.delegate(MOUSELEAVE, this._onDomEvent, tbodyFilter, this, "tbodyCellMouseleave");
        tableNode.delegate(MOUSEUP, this._onDomEvent, tbodyFilter, this, "tbodyCellMouseup");
        tableNode.delegate(MOUSEDOWN, this._onDomEvent, tbodyFilter, this, "tbodyCellMousedown");
        tableNode.delegate(CLICK, this._onDomEvent, tbodyFilter, this, "tbodyCellClick");
        // Since we can't listen for click and dblclick on the same element...
        contentBox.delegate(DOUBLECLICK, this._onEvent, tbodyFilter, this, "tbodyCellDoubleclick");

        // Bind to message TBODY DOM events
        tableNode.delegate(FOCUS, this._onDomEvent, msgFilter, this, "msgCellFocus");
        tableNode.delegate(KEYDOWN, this._onDomEvent, msgFilter, this, "msgCellKeydown");
        tableNode.delegate(MOUSEENTER, this._onDomEvent, msgFilter, this, "msgCellMouseenter");
        tableNode.delegate(MOUSELEAVE, this._onDomEvent, msgFilter, this, "msgCellMouseleave");
        tableNode.delegate(MOUSEUP, this._onDomEvent, msgFilter, this, "msgCellMouseup");
        tableNode.delegate(MOUSEDOWN, this._onDomEvent, msgFilter, this, "msgCellMousedown");
        tableNode.delegate(CLICK, this._onDomEvent, msgFilter, this, "msgCellClick");
        // Since we can't listen for click and dblclick on the same element...
        contentBox.delegate(DOUBLECLICK, this._onDomEvent, msgFilter, this, "msgCellDoubleclick");
    },
    
    /**
    * On DOM event, fires corresponding custom event.
    *
    * @method _onDomEvent
    * @param e {DOMEvent} The original DOM event facade.
    * @param type {String} Corresponding custom event to fire.
    * @private
    */
    _onDomEvent: function(e, type) {
        this.fire(type, e);
    },

    //TODO: abstract this out
    _defTheadCellClickFn: function(e) {
        this.fire("theadRowClick", e);
    },

    _defTheadRowClickFn: function(e) {
        this.fire("theadClick", e);
    },

    _defTheadClickFn: function(e) {
    },

    ////////////////////////////////////////////////////////////////////////////
    //
    // SYNC
    //
    ////////////////////////////////////////////////////////////////////////////

    /**
    * Syncs UI to intial state.
    *
    * @method syncUI
    * @private
    */
    syncUI: function() {
        // THEAD ROWS
        this._uiSetColumnset(this.get("columnset"));
        // DATA ROWS
        this._uiSetRecordset(this.get("recordset"));
        // STRINGS
        this._uiSetStrings(this.get("strings"));
    },

    /**
     * Updates all strings.
     *
     * @method _uiSetStrings
     * @param strings {Object} Collection of new strings.
     * @protected
     */
    _uiSetStrings: function (strings) {
        this._uiSetSummary(strings.summary);
        this._uiSetCaption(strings.caption);
    },

    /**
     * Updates summary.
     *
     * @method _uiSetSummary
     * @param val {String} New summary.
     * @protected
     */
    _uiSetSummary: function(val) {
        this._tableNode.set("summary", val);
    },

    /**
     * Updates caption.
     *
     * @method _uiSetCaption
     * @param val {String} New caption.
     * @protected
     */
    _uiSetCaption: function(val) {
        this._captionNode.setContent(val);
    },


    ////////////////////////////////////////////////////////////////////////////
    //
    // THEAD/COLUMNSET FUNCTIONALITY
    //
    ////////////////////////////////////////////////////////////////////////////
    /**
     * Updates THEAD.
     *
     * @method _uiSetColumnset
     * @param cs {Y.Columnset} New Columnset.
     * @protected
     */
    _uiSetColumnset: function(cs) {
        var tree = cs.get("tree"),
            thead = this._theadNode,
            i = 0,
            len = tree.length,
            parent = thead.get("parentNode"),
            nextSibling = thead.next();
            
        // Move THEAD off DOM
        thead.remove();
        
        thead.get("children").remove(true);

        // Iterate tree of columns to add THEAD rows
        for(; i<len; ++i) {
            this._addTheadTrNode({thead:thead, columns:tree[i]}, (i === 0), (i === len-1));
        }

        // Column helpers needs _theadNode to exist
        //this._createColumnHelpers();

        
        // Re-attach THEAD to DOM
        parent.insert(thead, nextSibling);

     },
     
    /**
    * Creates and attaches header row element.
    *
    * @method _addTheadTrNode
    * @param o {Object} {thead, columns}.
    * @param isFirst {Boolean} Is first row.
    * @param isFirst {Boolean} Is last row.
    * @protected
    */
     _addTheadTrNode: function(o, isFirst, isLast) {
        o.tr = this._createTheadTrNode(o, isFirst, isLast);
        this._attachTheadTrNode(o);
     },
     

    /**
    * Creates header row element.
    *
    * @method _createTheadTrNode
    * @param o {Object} {thead, columns}.
    * @param isFirst {Boolean} Is first row.
    * @param isLast {Boolean} Is last row.
    * @protected
    * @returns Y.Node
    */
    _createTheadTrNode: function(o, isFirst, isLast) {
        //TODO: custom classnames
        var tr = Ycreate(Ysubstitute(this.get("trTemplate"), o)),
            i = 0,
            columns = o.columns,
            len = columns.length,
            column;

         // Set FIRST/LAST class
        if(isFirst) {
            tr.addClass(CLASS_FIRST);
        }
        if(isLast) {
            tr.addClass(CLASS_LAST);
        }

        for(; i<len; ++i) {
            column = columns[i];
            this._addTheadThNode({value:column.get("label"), column: column, tr:tr});
        }

        return tr;
    },

    /**
    * Attaches header row element.
    *
    * @method _attachTheadTrNode
    * @param o {Object} {thead, columns, tr}.
    * @protected
    */
    _attachTheadTrNode: function(o) {
        o.thead.appendChild(o.tr);
    },

    /**
    * Creates and attaches header cell element.
    *
    * @method _addTheadThNode
    * @param o {Object} {value, column, tr}.
    * @protected
    */
    _addTheadThNode: function(o) {
        o.th = this._createTheadThNode(o);
        this._attachTheadThNode(o);
    },

    /**
    * Creates header cell element.
    *
    * @method _createTheadThNode
    * @param o {Object} {value, column, tr}.
    * @protected
    * @returns Y.Node
    */
    _createTheadThNode: function(o) {
        var column = o.column;
        
        // Populate template object
        o.id = column.get("id");//TODO: validate 1 column ID per document
        o.colspan = column.get("colSpan");
        o.rowspan = column.get("rowSpan");
        //TODO o.abbr = column.get("abbr");
        o.classnames = column.get("classnames");
        o.value = Ysubstitute(this.get("thValueTemplate"), o);

        /*TODO
        // Clear minWidth on hidden Columns
        if(column.get("hidden")) {
            //this._clearMinWidth(column);
        }
        */
        
        //column._set("thNode", o.th);

        return Ycreate(Ysubstitute(this.thTemplate, o));
    },

    /**
    * Attaches header cell element.
    *
    * @method _attachTheadTrNode
    * @param o {Object} {value, column, tr}.
    * @protected
    */
    _attachTheadThNode: function(o) {
        o.tr.appendChild(o.th);
    },

    ////////////////////////////////////////////////////////////////////////////
    //
    // TBODY/RECORDSET FUNCTIONALITY
    //
    ////////////////////////////////////////////////////////////////////////////
    /**
     * Updates TBODY.
     *
     * @method _uiSetRecordset
     * @param rs {Y.Recordset} New Recordset.
     * @protected
     */
    _uiSetRecordset: function(rs) {
        var i = 0,//TODOthis.get("state.offsetIndex")
            len = rs.getLength(), //TODOthis.get("state.pageLength")
            tbody = this._tbodyNode,
            parent = tbody.get("parentNode"),
            nextSibling = tbody.next(),
            o = {tbody:tbody}; //TODO: not sure best time to do this -- depends on sdt

        // Move TBODY off DOM
        tbody.remove();

        // Iterate Recordset to use existing TR when possible or add new TR
        for(; i<len; ++i) {
            o.record = rs.getRecord(i);
            o.rowindex = i;
            this._addTbodyTrNode(o); //TODO: sometimes rowindex != recordindex
        }
        
        // Re-attach TBODY to DOM
        parent.insert(tbody, nextSibling);
    },

    /**
    * Creates and attaches data row element.
    *
    * @method _addTbodyTrNode
    * @param o {Object} {tbody, record}
    * @protected
    */
    _addTbodyTrNode: function(o) {
        var tbody = o.tbody,
            record = o.record;
        o.tr = tbody.one("#"+record.get("id")) || this._createTbodyTrNode(o);
        this._attachTbodyTrNode(o);
    },

    /**
    * Creates data row element.
    *
    * @method _createTbodyTrNode
    * @param o {Object} {tbody, record}
    * @protected
    * @returns Y.Node
    */
    _createTbodyTrNode: function(o) {
        var tr = Ycreate(Ysubstitute(this.get("trTemplate"), {id:o.record.get("id")})),
            i = 0,
            allKeys = this.get("columnset").get("keys"),
            len = allKeys.length;

        o.tr = tr;
        
        for(; i<len; ++i) {
            o.column = allKeys[i];
            this._addTbodyTdNode(o);
        }
        
        return tr;
    },

    /**
    * Attaches data row element.
    *
    * @method _attachTbodyTrNode
    * @param o {Object} {tbody, record, tr}.
    * @protected
    */
    _attachTbodyTrNode: function(o) {
        var tbody = o.tbody,
            tr = o.tr,
            index = o.rowindex,
            nextSibling = tbody.get("children").item(index) || null,
            isEven = (index%2===0);
            
        if(isEven) {
            tr.replaceClass(CLASS_ODD, CLASS_EVEN);
        }
        else {
            tr.replaceClass(CLASS_EVEN, CLASS_ODD);
        }
        
        tbody.insertBefore(tr, nextSibling);
    },

    /**
    * Creates and attaches data cell element.
    *
    * @method _addTbodyTdNode
    * @param o {Object} {record, column, tr}.
    * @protected
    */
    _addTbodyTdNode: function(o) {
        o.td = this._createTbodyTdNode(o);
        this._attachTbodyTdNode(o);
    },
    
    /**
    * Creates data cell element.
    *
    * @method _createTbodyTdNode
    * @param o {Object} {record, column, tr}.
    * @protected
    * @returns Y.Node
    */
    _createTbodyTdNode: function(o) {
        var column = o.column;
        //TODO: attributes? or methods?
        o.headers = column.get("headers");
        o.classnames = column.get("classnames");
        o.value = this.formatDataCell(o);
        return Ycreate(Ysubstitute(this.tdTemplate, o));
    },
    
    /**
    * Attaches data cell element.
    *
    * @method _attachTbodyTdNode
    * @param o {Object} {record, column, tr, headers, classnames, value}.
    * @protected
    */
    _attachTbodyTdNode: function(o) {
        o.tr.appendChild(o.td);
    },

    /**
     * Returns markup to insert into data cell element.
     *
     * @method formatDataCell
     * @param @param o {Object} {record, column, tr, headers, classnames}.
     */
    formatDataCell: function(o) {
        var record = o.record;
        o.data = record.get("data");
        o.value = record.getValue(o.column.get("key"));
        return Ysubstitute(this.get("tdValueTemplate"), o);
    }
});

Y.namespace("DataTable").Base = DTBase;


}, '@VERSION@' ,{requires:['intl','substitute','widget','recordset-base'], lang:['en']});
YUI.add('datatable-sort', function(Y) {

/**
 * Plugs DataTable with sorting functionality.
 *
 * @module datatable
 * @submodule datatable-sort
 */

/**
 * Adds column sorting to DataTable.
 * @class DataTableSort
 * @extends Plugin.Base
 */
var YgetClassName = Y.ClassNameManager.getClassName,

    DATATABLE = "datatable",
    ASC = "asc",
    DESC = "desc",
    
    CLASS_ASC = YgetClassName(DATATABLE, "asc"),
    CLASS_DESC = YgetClassName(DATATABLE, "desc"),
    CLASS_SORTABLE = YgetClassName(DATATABLE, "sortable"),

    //TODO: Don't use hrefs - use tab/arrow/enter
    TEMPLATE = '<a class="{link_class}" title="{link_title}" href="{link_href}">{value}</a>';


function DataTableSort() {
    DataTableSort.superclass.constructor.apply(this, arguments);
}

/////////////////////////////////////////////////////////////////////////////
//
// STATIC PROPERTIES
//
/////////////////////////////////////////////////////////////////////////////
Y.mix(DataTableSort, {
    /**
     * The namespace for the plugin. This will be the property on the host which
     * references the plugin instance.
     *
     * @property NS
     * @type String
     * @static
     * @final
     * @value "sort"
     */
    NS: "sort",

    /**
     * Class name.
     *
     * @property NAME
     * @type String
     * @static
     * @final
     * @value "dataTableSort"
     */
    NAME: "dataTableSort",

/////////////////////////////////////////////////////////////////////////////
//
// ATTRIBUTES
//
/////////////////////////////////////////////////////////////////////////////
    ATTRS: {
        /**
        * @attribute trigger
        * @description Name of DataTable custom event that should trigger a
        * column to sort.
        * @type String
        * @default "theadCellClick"
        * @initOnly
        */
        trigger: {
            value: "theadCellClick",
            writeOnce: "initOnly"
        },
        
        /**
        * @attribute sortedBy
        * @description Sort state: {field,dir}
        * @type Object
        */
        sortedBy: {
            value: null
        },
        
        /**
        * @attribute template
        * @description Tokenized markup template for TH sort element.
        * @type String
        * @default '<a class="{link_class}" title="{link_title}" href="{link_href}">{value}</a>'
        */
        template: {
            value: TEMPLATE
        }
    }
});

/////////////////////////////////////////////////////////////////////////////
//
// PROTOTYPE
//
/////////////////////////////////////////////////////////////////////////////
Y.extend(DataTableSort, Y.Plugin.Base, {

    /////////////////////////////////////////////////////////////////////////////
    //
    // METHODS
    //
    /////////////////////////////////////////////////////////////////////////////
    /**
    * Initializer.
    *
    * @method initializer
    * @param config {Object} Config object.
    * @private
    */
    initializer: function(config) {
        var dt = this.get("host");
        dt.get("recordset").plug(Y.Plugin.RecordsetSort, {dt: dt});
        dt.get("recordset").sort.addTarget(dt);
        
        // Wrap link around TH value
        this.doBefore("_createTheadThNode", this._beforeCreateTheadThNode);
        
        // Add class
        this.doBefore("_attachTheadThNode", function(o) {
            if(o.column.get("sortable")) {
                o.th.addClass(CLASS_SORTABLE);
            }
        });

        // Attach trigger handlers
        dt.on(this.get("trigger"), this._onEventSortColumn);

        // Attach UI hooks
        dt.after("recordsetSort:sort", function() {
            dt._uiSetRecordset(dt.get("recordset"));
        });
        dt.after("sortedByChangeEvent", function() {
            //alert('ok');
        });

        //TODO
        //dt.after("recordset:mutation", function() {//reset sortedBy});
        
        //TODO
        //add Column sortFn ATTR
        
        // Update UI after the fact (plug-then-render case)
        if(dt.get("rendered")) {
            dt._uiSetColumnset(dt.get("columnset"));
        }
    },

    /**
    * Before header cell element is created, inserts link markup around {value}.
    *
    * @method _beforeCreateTheadThNode
    * @param o {Object} {value, column, tr}.
    * @protected
    */
    _beforeCreateTheadThNode: function(o) {
        if(o.column.get("sortable")) {
            o.value = Y.substitute(this.get("template"), {
                link_class: "foo",
                link_title: "bar",
                link_href: "bat",
                value: o.value
            });
        }
    },

    /**
    * In response to the "trigger" event, sorts the underlying Recordset and
    * updates the sortedBy attribute.
    *
    * @method _beforeCreateTheadThNode
    * @param o {Object} {value, column, tr}.
    * @protected
    */
    _onEventSortColumn: function(e) {
        e.halt();
        //TODO: normalize e.currentTarget to TH
        var column = this.get("columnset").get("hash")[e.currentTarget.get("id")],
            field = column.get("field"),
            prevSortedBy = this.get("sortedBy"),
            dir = (prevSortedBy &&
                prevSortedBy.field === field &&
                prevSortedBy.dir === ASC) ? DESC : ASC,
            sorter = column.get("sortFn");
        if(column.get("sortable")) {
            this.get("recordset").sort.sort(field, dir === DESC, sorter);
            this.set("sortedBy", {field: field, dir: dir});
        }
    }
});

Y.namespace("Plugin").DataTableSort = DataTableSort;





}, '@VERSION@' ,{lang:['en'], requires:['plugin','datatable-base','recordset-sort']});
YUI.add('datatable-scroll', function(Y) {

/**
 * Extends DataTable base to enable x,y, and xy scrolling.
 * @module datatable
 * @submodule datatable-scroll
 */


var YDo = Y.Do,
	YNode = Y.Node,
	YLang = Y.Lang,
	YUA = Y.UA,
	YStyleSheet = Y.StyleSheet,
	YgetClassName = Y.ClassNameManager.getClassName,
	DATATABLE = "datatable",
	CLASS_HEADER = YgetClassName(DATATABLE, "hd"),
	CLASS_BODY = YgetClassName(DATATABLE, "bd"),
	CLASS_LINER = YgetClassName(DATATABLE, "liner"),
	CLASS_SCROLLABLE = YgetClassName(DATATABLE, "scrollable"),
	CONTAINER_HEADER = '<div class="'+CLASS_HEADER+'"></div>',
	CONTAINER_BODY = '<div class="'+CLASS_BODY+'"></div>',
	TEMPLATE_TABLE = '<table></table>';
	

function DataTableScroll() {
    DataTableScroll.superclass.constructor.apply(this, arguments);
}

Y.mix(DataTableScroll, {
    NS: "scroll",

    NAME: "dataTableScroll",

    ATTRS: {
	
		/**
	    * @description The width for the table. Set to a string (ex: "200px", "20em")
	    *
	    * @attribute width
	    * @public
	    * @static
	    * @type string
	    */
        width: {
			value: undefined
		},
		
		/**
	    * @description The height for the table. Set to a string (ex: "200px", "20em")
	    *
	    * @attribute height
	    * @public
	    * @static
	    * @type string
	    */
		height: {
			value: undefined
		},
		
		
		/**
	    * @description The scrolling direction for the table. Can be set to 'x', 'y', or 'xy'
	    *
	    * @attribute scroll
	    * @public
	    * @static
	    * @type string
	    */
		scroll: {
			value: 'y'
		},
		
		
		/**
	    * @description The hexadecimal colour value to set on the top-right of the table if a scrollbar exists. 
	    *
	    * @attribute COLOR_COLUMNFILLER
	    * @public
	    * @static
	    * @type string
	    */
		COLOR_COLUMNFILLER: {
			value: '#f2f2f2',
			validator: YLang.isString,
			setter: function(param) {
				if (this._headerContainerNode) {
					this._headerContainerNode.setStyle('backgroundColor', param);
				}
			}
		}
    }
});

Y.extend(DataTableScroll, Y.Plugin.Base, {
	
	/**
    * @description The table node created in datatable-base
    *
    * @property _parentTableNode
	* @private
    * @type Y.Node
    */
	_parentTableNode: null,
	
	
	/**
    * @description The THEAD node which resides within the table node created in datatable-base
    *
    * @property _parentTheadNode
	* @private
    * @type Y.Node
    */
	_parentTheadNode: null,
	
	
	/**
    * @description The TBODY node which resides within the table node created in datatable-base
    *
    * @property _parentTbodyNode
	* @private
    * @type Y.Node
    */
	_parentTbodyNode: null,
	
	
	/**
    * @description The TBODY Message node which resides within the table node created in datatable-base
    *
    * @property _parentMsgNode
	* @private
    * @type Y.Node
    */
	_parentMsgNode: null,
	
	
	/**
    * @description The contentBox specified for the datatable in datatable-base
    *
    * @property _parentContainer
	* @private
    * @type Y.Node
    */
	_parentContainer: null,
	
	
	/**
    * @description The DIV node that contains all the scrollable elements (a table with a tbody on it)
    *
    * @property _bodyContainerNode
	* @private
    * @type Y.Node
    */
	_bodyContainerNode: null,
	
	
	/**
    * @description The DIV node that contains a table with a THEAD in it (which syncs its horizontal scroll with the _bodyContainerNode above)
    *
    * @property _headerContainerNode
	* @private
    * @type Y.Node
    */
	_headerContainerNode: null,
	
	
	//--------------------------------------
    //  Methods
    //--------------------------------------


	
	initializer: function(config) {
        var dt = this.get("host");
		this._parentContainer = dt.get('contentBox');
		this._parentContainer.addClass(CLASS_SCROLLABLE);
		this._setUpNodes();
	},
	
	/////////////////////////////////////////////////////////////////////////////
	//
	// Set up Table Nodes
	//
	/////////////////////////////////////////////////////////////////////////////
	
	/**
    * @description Set up methods to fire after host methods execute
    *
    * @method _setUpNodes
    * @private
    */			
	_setUpNodes: function() {
		var dt = this.get('host');
		
		this.afterHostMethod("_addTableNode", this._setUpParentTableNode);
		this.afterHostMethod("_addTheadNode", this._setUpParentTheadNode); 
		this.afterHostMethod("_addTbodyNode", this._setUpParentTbodyNode);
		this.afterHostMethod("_addMessageNode", this._setUpParentMessageNode);
       	
		this.afterHostMethod("renderUI", this.renderUI);
		this.afterHostMethod("syncUI", this.syncUI);
		
		if (this.get('scroll') !== 'x') {
			this.afterHostMethod('_attachTheadThNode', this._attachTheadThNode);
			this.afterHostMethod('_attachTbodyTdNode', this._attachTbodyTdNode);
		}
	},
		
	/**
    * @description Stores the main <table> node provided by the host as a private property
    *
    * @method _setUpParentTableNode
    * @private
    */
	_setUpParentTableNode: function() {
		this._parentTableNode = this.get('host')._tableNode;
	},
	
	
	/**
    * @description Stores the main <thead> node provided by the host as a private property
    *
    * @method _setUpParentTheadNode
    * @private
    */
	_setUpParentTheadNode: function() {
		this._parentTheadNode = this.get('host')._theadNode;
	},
	
	/**
    * @description Stores the main <tbody> node provided by the host as a private property
    *
    * @method _setUpParentTbodyNode
    * @private
    */
	_setUpParentTbodyNode: function() {
		this._parentTbodyNode = this.get('host')._tbodyNode;
	},
	
	
	/**
    * @description Stores the main <tbody> message node provided by the host as a private property
    *
    * @method _setUpParentMessageNode
    * @private
    */
	_setUpParentMessageNode: function() {
		this._parentMsgNode = this.get('host')._msgNode;
	},
	
	/////////////////////////////////////////////////////////////////////////////
	//
	// Renderer
	//
	/////////////////////////////////////////////////////////////////////////////
	
	/**
    * @description Primary rendering method that takes the datatable rendered in
    * the host, and splits it up into two separate <divs> each containing two 
	* separate tables (one containing the head and one containing the body). 
	* This method fires after renderUI is called on datatable-base.
	* 
    * @method renderUI
    * @public
    */
	renderUI: function() {
		//Y.Profiler.start('render');
		this._createBodyContainer();
		this._createHeaderContainer();
		this._setContentBoxDimensions();
		//Y.Profiler.stop('render');
		//console.log(Y.Profiler.getReport("render"));
	},
	
	
	/**
    * @description Post rendering method that is responsible for creating a column
	* filler, and performing width and scroll synchronization between the <th> 
	* elements and the <td> elements.
	* This method fires after syncUI is called on datatable-base
	* 
    * @method syncUI
    * @public
    */
	syncUI: function() {
		//Y.Profiler.start('sync');
		this._syncWidths();
		this._syncScroll();
		//Y.Profiler.stop('sync');
		//console.log(Y.Profiler.getReport("sync"));
		
	},
	
	
	/**
    * @description Adjusts the width of the TH and the TDs to make sure that the two are in sync
	* 
	* Implementation Details: 
	* 	Compares the width of the TH liner div to the the width of the TD node. The TD liner width
	*	is not actually used because the TD often stretches past the liner if the parent DIV is very
	*	large. Measuring the TD width is more accurate.
	*	
	*	Instead of measuring via .get('width'), 'clientWidth' is used, as it returns a number, whereas
	*	'width' returns a string, In IE6, 'clientWidth' is not supported, so 'offsetWidth' is used.
	*	'offsetWidth' is not as accurate on Chrome,FF as 'clientWidth' - thus the need for the fork.
	* 
    * @method _syncWidths
    * @public
    */
	_syncWidths: function() {
		var th = YNode.all('#'+this._parentContainer.get('id')+' .yui3-datatable-hd table thead th'), //nodelist of all THs
			td = YNode.one('#'+this._parentContainer.get('id')+' .yui3-datatable-bd table .yui3-datatable-data').get('firstChild').get('children'), //nodelist of all TDs in 1st row
			i,
			len,
			thWidth, tdWidth, thLiner, tdLiner,
			ie = YUA.ie;
			//stylesheet = new YStyleSheet('columnsSheet'),
			//className;
			
			/*
			This for loop goes through the first row of TDs in the table.
			In a table, the width of the row is equal to the width of the longest cell in that column.
			Therefore, we can observe the widths of the cells in the first row only, as they will be the same in all the cells below (in each respective column)
			*/
			for (i=0, len = th.size(); i<len; i++) { 
				
				//className = '.'+td.item(i).get('classList')._nodes[0];
				//If a width has not been already set on the TD:
				//if (td.item(i).get('firstChild').getStyle('width') === "auto") {
					
					//Get the liners for the TH and the TD cell in question
					thLiner = th.item(i).get('firstChild'); //TODO: use liner API - how? this is a node.
					tdLiner = td.item(i).get('firstChild');
					
					/*
					If browser is not IE - get the clientWidth of the Liner div and the TD.
					Note: 	We are not getting the width of the TDLiner, we are getting the width of the actual cell.
							Why? Because when the table is set to auto width, the cell will grow to try to fit the table in its container.
							The liner could potentially be much smaller than the cell width.
							
							TODO: Explore if there is a better way using only LINERS widths
					*/
					if (!ie) {
						thWidth = thLiner.get('clientWidth'); //TODO: this should actually be done with getComputedStyle('width') but this messes up columns. Explore this option.
						tdWidth = td.item(i).get('clientWidth');
					}
					
					//IE wasn't recognizing clientWidths, so we are using offsetWidths.
					//TODO: should use getComputedStyle('width') because offsetWidth will screw up when padding is changed.
					else {
						thWidth = thLiner.get('offsetWidth');
						tdWidth = td.item(i).get('offsetWidth');
						//thWidth = parseFloat(thLiner.getComputedStyle('width').split('px')[0]);
						//tdWidth = parseFloat(td.item(i).getComputedStyle('width').split('px')[0]); /* TODO: for some reason, using tdLiner.get('clientWidth') doesn't work - why not? */
					}
										
					//if TH is bigger than TD, enlarge TD Liner
					if (thWidth > tdWidth) {
						tdLiner.setStyle('width', (thWidth - 20 + 'px'));
						//thLiner.setStyle('width', (tdWidth - 20 + 'px'));
						//stylesheet.set(className,{'width': (thWidth - 20 + 'px')});
					}
					
					//if TD is bigger than TH, enlarge TH Liner
					else if (tdWidth > thWidth) {
						thLiner.setStyle('width', (tdWidth - 20 + 'px'));
						//tdLiner.setStyle('width', (tdWidth - 20 + 'px'));
						//stylesheet.set(className,{'width': (tdWidth - 20 + 'px')});
					}
					
				//}

			}
			
			//stylesheet.enable();
			
			//After the widths have synced, there is a wrapping issue in the headerContainer in IE6. The header does not span the full
			//length of the table (does not cover all of the y-scrollbar). By adding this line in when there is a y-scroll, the header will span correctly.
			
			//TODO: this should not really occur on this.get('scroll') === y - it should occur when scrollHeight > clientHeight, but clientHeight is not getting recognized in IE6?
			if (ie && this.get('scroll') === 'y' && this._bodyContainerNode.get('scrollHeight') > this._bodyContainerNode.get('offsetHeight')) {
				this._headerContainerNode.setStyle('width', this._parentContainer.get('offsetWidth')+ 15 +'px');
			}		
	},
	
	/**
    * @description Adds the approriate width to the liner divs of the TH nodes before they are appended to DOM
	*
    * @method _attachTheadThNode
    * @public
    */
	_attachTheadThNode: function(o) {
		var w = o.column.get('width') || 'auto';
		
		if (w !== 'auto') {
			o.th.get('firstChild').setStyles({'width': w, 'overflow':'hidden'}); //TODO: use liner API but liner is undefined here (not created?)
		}
		return o;
	},
	
	/**
    * @description Adds the appropriate width to the liner divs of the TD nodes before they are appended to DOM
	*
    * @method _attachTbodyTdNode
    * @public
    */
	_attachTbodyTdNode: function(o) {
		var w = o.column.get('width') || 'auto';
		
		if (w !== 'auto') {
			o.td.get('firstChild').setStyles({'width': w, 'overflow': 'hidden'}); //TODO: use liner API but liner is undefined here (not created?)
			//o.td.setStyles({'width': w, 'overflow': 'hidden'});
		}
		return o;
	},
	
	/**
    * @description Creates the body DIV that contains all the data. 
	*
    * @method _createBodyContainer
    * @private
    */
	_createBodyContainer: function() {
		var	bd = YNode.create(CONTAINER_BODY),
			onScrollFn = Y.bind("_onScroll", this);
			
		this._bodyContainerNode = bd;		
		this._setStylesForTbody();
		
		bd.appendChild(this._parentTableNode);
		this._parentContainer.appendChild(bd);
		bd.on('scroll', onScrollFn);
	},
	
	/**
    * @description Creates the DIV that contains a <table> with all the headers. 
	*
    * @method _createHeaderContainer
    * @private
    */
	_createHeaderContainer: function() {
		var hd = YNode.create(CONTAINER_HEADER),
			tbl = YNode.create(TEMPLATE_TABLE);
			
		this._headerContainerNode = hd;
		
		//hd.setStyle('backgroundColor',this.get("COLOR_COLUMNFILLER"));
		this._setStylesForThead();
		tbl.appendChild(this._parentTheadNode);
		hd.appendChild(tbl);
		this._parentContainer.prepend(hd);
		
	},
	
	/**
    * @description Creates styles for the TBODY based on what type of table it is.
	*
    * @method _setStylesForTbody
    * @private
    */
	_setStylesForTbody: function() {
		var dir = this.get('scroll'),
			w = this.get('width') || "",
			h = this.get('height') || "",
			el = this._bodyContainerNode,
			styles = {'width':"", 'height':h};
				
		if (dir === 'x') {
			//X-Scrolling tables should not have a Y-Scrollbar so overflow-y is hidden. THe width on x-scrolling tables must be set by user.
			styles['overflowY'] = 'hidden';
			styles['width'] = w;
		}
		else if (dir === 'y') {
			//Y-Scrolling tables should not have a X-Scrollbar so overflow-x is hidden. The width isn't neccessary because it can be auto.
			styles['overflowX'] = 'hidden';
		}
		
		else {
			//assume xy - the width must be set on xy.
			styles['width'] = w;
		}
		
		el.setStyles(styles);
		return el;
	},
	
	
	/**
    * @description Creates styles for the THEAD based on what type of datatable it is.
	*
    * @method _setStylesForThead
    * @private
    */
	_setStylesForThead: function() {
		var dir = this.get('scroll'),
			w = this.get('width') || "",
			el = this._headerContainerNode;
		
		//if (dir !== 'y') {
			el.setStyles({'width': w, 'overflow': 'hidden'});
		// }
	},
	
	/**
    * @description Sets an auto width on the content box if it doesn't exist or if its a y-datatable.
	*
    * @method _setContentBoxDimensions
    * @private
    */
	_setContentBoxDimensions: function() {
		
		if (this.get('scroll') === 'y' || (!this.get('width'))) {
			this._parentContainer.setStyle('width', 'auto');
		}
		
	},
	
	/////////////////////////////////////////////////////////////////////////////
	//
	// Scroll Syncing
	//
	/////////////////////////////////////////////////////////////////////////////
	
	/**
    * @description Ensures that scrolling is synced across the two tables
	*
    * @method _onScroll
    * @private
    */
	_onScroll: function() {
		this._headerContainerNode.set('scrollLeft', this._bodyContainerNode.get('scrollLeft'));
	},
	
	/**
	 * @description Syncs padding around scrollable tables, including Column header right-padding
	 * and container width and height.
	 *
	 * @method _syncScroll
	 * @private 
	 */
	_syncScroll : function() {
		this._syncScrollX();
		this._syncScrollY();
		this._syncScrollOverhang();
		if(YUA.opera) {
			// Bug 1925874
			this._headerContainerNode.set('scrollLeft', this._bodyContainerNode.get('scrollLeft'));
			
			if(!this.get("width")) {
		 		// Bug 1926125
		 		document.body.style += '';
		 	}
		}
	},
	
	/**
	* @description Snaps container width for y-scrolling tables.
	*
	* @method _syncScrollY
	* @private
	*/
	_syncScrollY : function() {
		var tBody = this._parentTbodyNode,
		    tBodyContainer = this._bodyContainerNode,
			w;
		    // X-scrolling not enabled
			if(!this.get("width")) {
		        // Snap outer container width to content
		        w = (tBodyContainer.get('scrollHeight') > tBodyContainer.get('clientHeight')) ?
		    	// but account for y-scrollbar since it is visible
					(tBody.get('parentNode').get('clientWidth') + 19) + "px" :
		     		// no y-scrollbar, just borders
            		(tBody.get('parentNode').get('clientWidth') + 2) + "px";
				this._parentContainer.setStyle('width', w);
		}
	},
		
	/**
	 * @description Snaps container height for x-scrolling tables in IE. Syncs message TBODY width. 
	 * Taken from YUI2 ScrollingDataTable.js
	 *
	 * @method _syncScrollX
	 * @private
	 */
	_syncScrollX: function() {
		var tBody = this._parentTbodyNode,
			tBodyContainer = this._bodyContainerNode,
			w;
			this._headerContainerNode.set('scrollLeft', this._bodyContainerNode.get('scrollLeft'));
			
			if(!this.get('height') && (YUA.ie)) {
						w = (tBodyContainer.get('scrollWidth') > tBodyContainer.get('offsetWidth')) ?
			            (tBody.get('parentNode').get('offsetHeight') + 18) + "px" : 
			            tBody.get('parentNode').get('offsetHeight') + "px";
						
						tBodyContainer.setStyle('height', w);
					}
			
		if (tBody.get('rows').length === 0) {
			this._parentMsgNode.get('parentNode').setStyle('width', this._parentTheadNode.get('parentNode').get('offsetWidth')+'px');
		}
		else {
			this._parentMsgNode.get('parentNode').setStyle('width', "");
		}
			
	},
	
	/**
	 * @description Adds/removes Column header overhang as necesary.
	 * Taken from YUI2 ScrollingDataTable.js
	 *
	 * @method _syncScrollOverhang
	 * @private
	 */
	_syncScrollOverhang: function() {
		var tBodyContainer = this._bodyContainerNode,
			padding = 1;
		
		//when its both x and y scrolling
		if ((tBodyContainer.get('scrollHeight') > tBodyContainer.get('clientHeight')) || (tBodyContainer.get('scrollWidth') > tBodyContainer.get('clientWidth'))) {
			padding = 18;
		}
		
		this._setOverhangValue(padding);
		

	},
	
	
	/**
	 * @description Sets Column header overhang to given width.
	 * Taken from YUI2 ScrollingDataTable.js with minor modifications
	 *
	 * @method _setOverhangValue
	 * @param nBorderWidth {Number} Value of new border for overhang. 
	 * @private
	 */ 
	_setOverhangValue: function(borderWidth) {
		var host = this.get('host'),
			cols = host.get('columnset').get('definitions'),
		 	//lastHeaders = cols[cols.length-1] || [],
	        len = cols.length,
	        value = borderWidth + "px solid " + this.get("COLOR_COLUMNFILLER"),
			children = YNode.all('#'+this._parentContainer.get('id')+ ' .' + CLASS_HEADER + ' table thead th');

		children.item(len-1).setStyle('borderRight', value);
	}
	
});

Y.namespace("Plugin").DataTableScroll = DataTableScroll;





}, '@VERSION@' ,{requires:['plugin','datatable-base','stylesheet']});


YUI.add('datatable', function(Y){}, '@VERSION@' ,{use:['datatable-base','datatable-sort','datatable-scroll']});

