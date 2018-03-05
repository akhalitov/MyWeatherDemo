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
                    id: "tileCompany",
                    buttons: [
                        {
                            id: "btnLogin",
                            title: _('Login'),
                            iconClass: "fa-external-link",
                            autoBusy: false,
                            onClick: function () {
                                window.open("http://www.myweatherdemo.com/login", "_blank");
                            }
                        }]
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
        },

        onContext: function () {
            var company = aps.context.vars.company;

            this.byId("outputUsername").set("value", company.username);
            this.byId("outputPassword").set("value", company.password);
            this.byId("tileCompany").set("title", company.company_id);

            aps.apsc.hideLoading(); // Mandatory call
        }
    });
});