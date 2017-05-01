//Load Dojo, Dijit and DojoX components
dojo.require("dojo.data.ItemFileWriteStore");
dojo.require("dijit.dijit");
dojo.require("dijit.layout.BorderContainer");
dojo.require("dijit.layout.ContentPane");
dojo.require("dijit.MenuBar");
dojo.require("dijit.PopupMenuBarItem");
dojo.require("dijit.Menu");
dojo.require("dijit.MenuItem");
dojo.require("dijit.Tree");
dojo.require("dojox.grid.DataGrid");
dojo.require("dijit.Dialog");
dojo.require("dijit.form.Form");
dojo.require("dijit.form.ValidationTextBox");
dojo.require("dijit.form.TextBox");
dojo.require("dijit.form.FilteringSelect");
dojo.require("dijit.form.Button");

dojo.addOnLoad(function() {

	dojo.connect(mnuNewGroup, "onClick", null, function(e) {
		newGroupDialog.show();
	});
	dojo.connect(newGroupCancel, "onClick", null, function(e) {
		newGroupDialog.hide();
	});
	dojo.connect(newGroupDialog, "onShow", null, function(e) {
		dijit.byId("new_group_name").reset();
	});
});