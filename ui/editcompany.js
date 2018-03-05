define([
    "dojo/_base/declare",
    "aps/xhr",
    "aps/_PopupView"
], function (
    declare,
    xhr,
    View) {
        return declare(View, {
            size: "sm",
            init: function () {

                return ["aps/Panel", {
                    id: "edit_form"
                },
                    [
                        ["aps/FieldSet", [
                            ["aps/TextBox", {
                                id: "tbusername",
                                label: "Username",
                                required: true
                            }]
                        ]],
                        ["aps/FieldSet", [
                            ["aps/TextBox", {
                                id: "tbpassword",
                                label: "Password",
                                required: true
                            }]
                        ]
                        ]

                    ]
                ];
            },    // End of Init
            onContext: function () {
                var company = aps.context.vars.company;
                this.byId("tbusername").set("value", company.username);
                this.byId("tbpassword").set("value", company.password);
                aps.apsc.hideLoading(); // Mandatory call
            },
            onHide: function () {
            },
            /* Handlers for the navigation buttons */
            onCancel: function () {
                this.cancel();

            },
            onSubmit: function () {
                if (!this.validate()) {
                    aps.apsc.cancelProcessing();
                    return;
                }
                var NEWDATA = {
                    "aps": { "type": "http://myweatherdemo.com/subscription_service/1.0" },
                    "username": this.byId('tbusername').value,
                    "password": this.byId("tbpassword").value
                };

                xhr('/aps/2/resources/' + aps.context.vars.company.aps.id,
                    {
                        method: 'PUT',
                        headers: { "Content-Type": "application/json" },
                        data: JSON.stringify(NEWDATA)
                    }).then(this.submit);
            }
        });    // End of Declare
    });        // End of Define