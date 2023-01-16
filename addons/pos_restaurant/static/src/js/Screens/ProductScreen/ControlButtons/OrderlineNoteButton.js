/** @odoo-module */

import { PosComponent } from "@point_of_sale/js/PosComponent";
import { ProductScreen } from "@point_of_sale/js/Screens/ProductScreen/ProductScreen";
import { useListener } from "@web/core/utils/hooks";
import { TextAreaPopup } from "@point_of_sale/js/Popups/TextAreaPopup";

export class OrderlineNoteButton extends PosComponent {
    static template = "OrderlineNoteButton";

    setup() {
        super.setup();
        useListener("click", this.onClick);
    }
    get selectedOrderline() {
        return this.env.pos.get_order().get_selected_orderline();
    }
    async onClick() {
        if (!this.selectedOrderline) {
            return;
        }

        const { confirmed, payload: inputNote } = await this.showPopup(TextAreaPopup, {
            startingValue: this.selectedOrderline.get_note(),
            title: this.env._t("Add Internal Note"),
        });

        if (confirmed) {
            this.selectedOrderline.set_note(inputNote);
        }
    }
}

ProductScreen.addControlButton({
    component: OrderlineNoteButton,
    condition: function () {
        return this.env.pos.config.iface_orderline_notes;
    },
});
