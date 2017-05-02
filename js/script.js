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
	var okDialogMsg = dojo.byId("okDialogMessage");
	
	//Process the adding of a new group to the database
	function doNewGroup(e){
		e.preventDefault();
		e.stopPropagation();
		dojo.byId("new_group_ajax").value = "1";
		if(this.isValid()) {
			dojo.xhrPost({
				form: this.domNode,
				handleAs: "json",
				load: function(data) {
					if(data.success) {
						okDialog.set("title", "Group Created Successfully");
						okDialogMsg.innerHTML = "The Group <strong>" + data.name + "</strong> was created Successfully.";

						groupStore.newItem({"id": data.id.toString(), "name": data.name}, {"parent": groupsModel.root, "attribute": "groups"});
						groupStore.save();

						newGroupDialog.hide();
						okDialog.show();
					} else {
						okDialog.set("title", "Error Creating Group");
						okDialogMsg.innerHTML = data.error;
						newGroupDialog.hide();
						okDialog.show();
					}
				},
				error: function(error) {
					console.log(error);
					okDialog.set("title", "Error Creating Group");
					okDialogMsg.innerHTML = error;
					newGroupDialog.hide();
					okDialog.show();
				}
			});
		}
	}
	
	//Configures the "Rename Group" dialog for the selected group
	function doRenameGroup(e){
		var group = groupsTree.get("selectedItem");
		var groupId = group.id;
		var groupName = group.name;

		dojo.byId("edit_group_id").value = groupId;
		dijit.byId("edit_group_old").set("value", groupName);
		editGroupDialog.show();
	}
	// Do Rename Group Data
	function doEditGroup(e) {
		e.preventDefault();
		e.stopPropagation();
		dojo.byId("edit_group_ajax").value = "1";
		if(this.isValid) {
			dojo.xhrPost({
				form: this.domNode,
				handleAs: "json",
				load: function(data) {
					if(data.success) {
						okDialog.set("title", "Group renamed Successfully");
						okDialogMsg.innerHTML = "The group <strong>"+data.name+"</strong> was renamed successfully.";

						var group = groupsTree.get("selectedItem");
						groupStore.setValue(group, "name", data.name);
						groupStore.save();

						editGroupDialog.hide();
						okDialog.show();
					} else {
						okDialog.set("title", "Error Renaming Group");
						okDialogMsg.innerHTML = data.error;
						editGroupDialog.hide();
						okDialog.show();
					}
				},
				error: function(error) {
					okDialog.set("title", "Error Renaming Group");
					okDialogMsg.innerHTML = error;
					editGroupDialog.hide();
					okDialog.show();
				}
			});
		}
	}
	//When a user selects a node in tree, enable/disable menus
	function selectNode(e) {
		var item = dijit.getEnclosingWidget(e.target).item;
		if(item !== undefined) {
			groupsTree.set("selectedItem", item);
			if(item.id != 0) {
				mnuRenameGroup.set("disabled", false);
				mnuDeleteGroup.set("disabled", false);
				ctxMnuRenameGroup.set("disabled", false);
				ctxMnuDeleteGroup.set("disabled", false);
			} else {
				mnuRenameGroup.set("disabled", true);
				mnuDeleteGroup.set("disabled", true);
				ctxMnuRenameGroup.set("disabled", true);
				ctxMnuDeleteGroup.set("disabled", true);
			}
		}
	}
	// When a user selects a row in grid, enable/disable menus
	function selectRow(e) {
		if(e.rowIndex != null) {
			this.selection.clear();
			this.selection.setSelected(e.rowIndex, true);
			// mnuEditContact - mnuMoveContact - mnuDeleteContact - ctxMnuEditContact - ctxMnuMoveContact - ctxMnuDeleteContact
			mnuEditContact.set("disabled", false);
			mnuMoveContact.set("disabled", false);
			mnuDeleteContact.set("disabled", false);
			ctxMnuEditContact.set("disabled", false);
			ctxMnuMoveContact.set("disabled", false);
			ctxMnuDeleteContact.set("disabled", false);
		}
	}
	// Refresh Grid
	function refreshGrid() {
		contactsGrid.selection.clear();
		mnuEditContact.set("disabled", true);
		mnuMoveContact.set("disabled", true);
		mnuDeleteContact.set("disabled", true);
		ctxMnuEditContact.set("disabled", true);
		ctxMnuMoveContact.set("disabled", true);
		ctxMnuDeleteContact.set("disabled", true);
		dijit.byId("contactView").set("content", "<em>Select a contact to view above.</em>");
	}
	// Display Contact by ID
	function displayContact(idx) {
		var item = this.getItem(idx);
		var contactId = item.id;
		contactView.set("href", "data/contact.php?contact_id=" + contactId);
		mnuEditContact.set("disabled", false);
		mnuMoveContact.set("disabled", false);
		mnuDeleteContact.set("disabled", false);
		ctxMnuEditContact.set("disabled", false);
		ctxMnuMoveContact.set("disabled", false);
		ctxMnuDeleteContact.set("disabled", false);
	}
	// Update the data grid to display contacts for the currently selected group
	function updateDataGrid(item) {
		var newURL = "data/contacts.php?group_id=" + item.id;
		var newStore = new dojo.data.ItemFileReadStore({url: newURL});
		contactsGrid.setStore(newStore);
		refreshGrid();
	}
	// Refresh the data store for the groups dropdown (in case groups added, edited or deleted)
	function refreshGroupDropDown() {
		//var theStore = dijit.byId().store;
	}
	// Move Contact Function
	function moveContact() {
		var contact = contactsGrid.selection.getSelected()[0];
		var contactName = contact.first_name + " " + contact.last_name;
		var groupName = contact.name;
		
		dojo.byId("move_contact_id").value = contact.id;
		dojo.byId("move_contact_name").value = contactName;
		dojo.byId("move_contact_old").value = groupName;
		dijit.byId("moveContactDialog").show();
	}
	// Do Move Contact Action Dialog
	function doMoveContact(e) {
		e.preventDefault();
		e.stopPropagation();
		dojo.byId("move_contact_ajax").value = "1";
		if(this.isValid){
			dojo.xhrPost({
				form: this.domNode,
				handleAs: "json",
				load: function(data) {
					if(data.success) {
						okDialog.set("title", "Contact Moved Successfully");
						okDialogMsg.innerHTML = "The contact was moved successfully.";

						var treeSel = groupsTree.get("selectedItem");
						var groupId;
						if(treeSel) {
							groupId = treeSel.id;
						} else {
							groupId = 0 ;
						}
						var url = contactStore.url + "?group_id=" + groupId;
						var newStore = new dojo.data.ItemFileReadStore({url: url});
						contactsGrid.setStore(newStore);
						refreshGrid();

						moveContactDialog.hide();
						okDialogMsg.show();
					} else {
						okDialog.set("title", "Error Moving Contact");
						okDialogMsg.innerHTML = data.error;
						// moveContactDialog.hide();
						okDialog.show();
					}
				},
				error: function(error) {
					okDialog.set("title", "Error Moving Contact");
					okDialogMsg.innerHTML = data.error;
					// moveContactDialog.hide();
					okDialog.show();
				}
			});
		}
	}
	//Reload contacts data grid when a user clicks on a node in the groups tree
	dojo.connect(groupsTree, "onClick", null, updateDataGrid);
	// Groups Tree On Mouse Down Enable/Disable Menus
	dojo.connect(groupsTree, "onMouseDown", null, selectNode);
	//Select data grid row on right click
	dojo.connect(contactsGrid, "onRowContextMenu", null, selectRow);
	//Display contact detail on data grid selection
	dojo.connect(contactsGrid, "onSelected", null, displayContact);
	// Hide OK Dialog OK
	dojo.connect(okDialogOK, "onClick", null, function(){
		okDialog.hide();
	});
	// New Group Dialog Events {show Dilaog, Event of Cancel Group, OnShow Reset Group Data}
	dojo.connect(mnuNewGroup, "onClick", null, function(e) {
		newGroupDialog.show();
	});
	dojo.connect(newGroupCancel, "onClick", null, function(e) {
		newGroupDialog.hide();
	});
	dojo.connect(newGroupDialog, "onShow", null, function(e) {
		dijit.byId("new_group_name").reset();
	});
	dojo.connect(newGroupForm, "onSubmit", null, doNewGroup);
	// End New Group Dialog Events
	// EDit Group Dialog Events 
	dojo.connect(mnuRenameGroup, "onClick", null, doRenameGroup);
	dojo.connect(ctxMnuRenameGroup, "onClick", null, doRenameGroup);
	dojo.connect(editGroupCancel, "onClick", null, function(e) {
		editGroupDialog.hide();
	});
	dojo.connect(editGroupDialog, "onShow", null, function(e) {
		dijit.byId("edit_group_name").reset();
	});
	dojo.connect(editGroupForm, "onSubmit", null, doEditGroup);
	// End New Group Dialog Events
	// Context Menu And Toolbar Menu Events
	dojo.connect(mnuMoveContact, "onClick", null, moveContact);
	dojo.connect(ctxMnuMoveContact, "onClick", null, moveContact);

	// Contacts
	dojo.connect(moveContactForm, "onSubmit", null, doMoveContact);
	dojo.connect(moveContactCancel, "onClick", null, function(e) {
		moveContactDialog.hide();
	});
	dojo.connect(moveContactDialog, "onShow", null, function(e) {
		var theStore = dijit.byId("move_contact_new").store;
		theStore.close();
		theStore.url = "data/groups.php";
		theStore.fetch();
		dijit.byId("move_contact_new").reset();
	});
});