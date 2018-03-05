define([
    "dojo/_base/declare",
    "aps/xhr",
    "dijit/registry",
    "aps/_View"
], function (declare, xhr, registry, _View) {
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
                        },
                        {
                            id: "btnEdit",
                            title: _('Edit'),
                            iconClass: "fa-external-link",
                            autoBusy: false,
                            onClick: function () {
                                aps.apsc.showPopup({
                                    viewId: "editcompany",
                                    resourceId: null,
                                    modal: false
                                });
                            }
                        }
                    ]
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
                    ]],
                    ["aps/Tile", {
                        gridSize: "md-6",
                        id: "tileTemperature"
                    }, [
                            ["aps/FieldSet", {
                                gridSize: "md-12"
                            }, [
                                    ["aps/Output", {
                                        id: "outputCelsius",
                                        label: _("Celsius"),
                                        gridSize: "md-6"
                                    }],
                                    ["aps/Output", {
                                        id: "outputFahrenheit",
                                        label: _('fahrenheit'),
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

            xhr('/aps/2/resources/' + company.aps.id + '/getTemperature',
            {
                headers: {"Content-Type": "application/json"},
                method: "GET"
            }).then(function(temperature){
                registry.byId("outputCelsius").set("value", temperature.celsius);
                registry.byId("outputFahrenheit").set("value", temperature.fahrenheit);
                registry.byId("tileTemperature").set("title", temperature.city + " / " + temperature.country);
                aps.apsc.hideLoading(); // Mandatory call
            });

            aps.apsc.hideLoading(); // Mandatory call
        }
    });
});