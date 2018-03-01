define([
    "dojo/_base/declare",
    "aps/_View"
], function (declare, _View) {
    return declare(_View, {
        init: function () {
            return ["aps/Tiles", { id: "cpTiles" }, [
                ["aps/Tile", {
                    gridSize: "md-6",
                    title: _('External company id'),
                    id: "tileCompany"
                }, [
                        ["aps/FieldSet", {
                            gridSize: "md-12"
                        }, [
                                ["aps/Output", {
                                    id: "outputUsername",
                                    label: _("Name"),
                                    gridSize: "md-6"
                                }],
                                ["aps/Output", {
                                    id: "outputPassword",
                                    label: _('Password'),
                                    gridSize: "md-6"
                                }]
                            ]]
                    ]]
            ]];
        }
    });
});