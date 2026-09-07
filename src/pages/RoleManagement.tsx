import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Form } from "antd";
import { Shield, Plus, Pencil, Trash2, Search, Users, CheckCircle2, XCircle } from "lucide-react";

import InputForm from "@/components/Form";
import Notification from "@/components/Notification";
import { TableSkeleton } from "@/components/Skeletons";
import { useAuth } from "@/lib/auth";
import {
  useRoleList,
  useMenuList,
  useRoleCreate,
  useRoleUpdate,
  useRoleDelete,
} from "@/hooks/useAccess";

interface RoleRow {
  id: string;
  _id: string;
  name: string;
  description: string | null;
  is_system: boolean;
  is_active: boolean;
  user_count: number;
  menu_ids: string[];
  created_at: string;
}

interface MenuRow {
  id: string;
  code: string;
  label: string;
  path: string | null;
  parent_code: string | null;
  is_superadmin_only?: boolean;
}

export default function RoleManagementPage() {
  const { state } = useAuth();
  const navigate = useNavigate();

  const [searchTerm, setSearchTerm] = useState("");
  const [show, setShow] = useState<"NONE" | "ADD" | "UPDATE">("NONE");
  const [formAction, setFormAction] = useState<any>();
  const [selectedMenuIds, setSelectedMenuIds] = useState<Set<string>>(new Set());
  const [deleteTarget, setDeleteTarget] = useState<RoleRow | null>(null);
  const [form] = Form.useForm();

  const { data: roles = [], isLoading, refetch } = useRoleList();
  const { data: menus = [] } = useMenuList();
  const { mutate: createRole, isPending: createPending } = useRoleCreate();
  const { mutate: updateRole, isPending: updatePending } = useRoleUpdate();
  const { mutate: deleteRole, isPending: deletePending } = useRoleDelete();

  // Guard: hanya SUPERADMIN
  useEffect(() => {
    if (!state.isLoading && (!state.user || state.user.role !== "SUPERADMIN")) {
      navigate("/", { replace: true });
    }
  }, [state, navigate]);

  const homeMenu = menus.find((m: MenuRow) => m.code === "home");
  const parentMenus = (menus as MenuRow[])
    .filter((m) => !m.parent_code)
    .sort((a, b) => a.label.localeCompare(b.label));

  const filteredRoles = (roles as RoleRow[]).filter((r) => {
    const q = searchTerm.toLowerCase();
    return (
      !q ||
      r.name.toLowerCase().includes(q) ||
      (r.description || "").toLowerCase().includes(q)
    );
  });

  const toggleMenu = (menuId: string, parentMenu?: MenuRow | null) => {
    // home tidak boleh di-uncheck
    if (homeMenu && menuId === homeMenu.id) return;
    setSelectedMenuIds((prev) => {
      const next = new Set(prev);
      if (next.has(menuId)) next.delete(menuId);
      else next.add(menuId);

      // Sinkronkan id menu induk: ikut aktif bila SEMUA anak terpilih,
      // hilang bila ada anak yang di-uncheck. (Server memakai parent row
      // agar group tampil di sidebar; my-menus juga auto-lengkapi, tapi
      // menyimpan id parent membuat data RoleMenu konsisten.)
      if (parentMenu) {
        const siblings = (menus as MenuRow[]).filter(
          (m) => m.parent_code === parentMenu.code,
        );
        const allSiblingsChecked = siblings.every((s) => next.has(s.id));
        if (allSiblingsChecked && siblings.length > 0) next.add(parentMenu.id);
        else next.delete(parentMenu.id);
      }
      return next;
    });
  };

  const visibleMenuIds = (ids: string[], isSuperRole: boolean): string[] => {
    // Buang id menu khusus SUPERADMIN bila role yg dikelola bukan SUPERADMIN
    if (isSuperRole) return ids;
    const hidden = new Set(
      (menus as MenuRow[])
        .filter((m) => m.is_superadmin_only)
        .map((m) => m.id),
    );
    return ids.filter((id) => !hidden.has(id));
  };

  const openAdd = () => {
    setFormAction({});
    setSelectedMenuIds(new Set(homeMenu ? [homeMenu.id] : []));
    form.resetFields();
    setShow("ADD");
  };

  const openEdit = (role: RoleRow) => {
    setFormAction(role);
    setSelectedMenuIds(
      new Set(visibleMenuIds(role.menu_ids, role.is_system && role.name === "SUPERADMIN")),
    );
    form.setFieldsValue({
      name: role.name,
      description: role.description || "",
    });
    setShow("UPDATE");
  };

  const handleSave = async () => {
    try {
      const values = await form.validateFields();
      const payload = {
        name: values.name,
        description: values.description,
        menu_ids: Array.from(selectedMenuIds),
      };

      if (show === "ADD") {
        createRole(payload as any, {
          onSuccess: (res: any) => {
            if (res?.status === 201) {
              Notification("success", "Role created successfully");
              setShow("NONE");
              refetch();
            } else {
              Notification("error", res?.message || "Failed to create role");
            }
          },
        });
      } else if (formAction?.id) {
        updateRole(
          { id: formAction.id, payload },
          {
            onSuccess: (res: any) => {
              if (res?.status === 200) {
                Notification("success", "Role updated successfully");
                setShow("NONE");
                refetch();
              } else {
                Notification("error", res?.message || "Failed to update role");
              }
            },
          },
        );
      }
    } catch {
      Notification("error", "Please fill required fields");
    }
  };

  const handleDelete = () => {
    if (!deleteTarget) return;
    deleteRole(deleteTarget.id, {
      onSuccess: (res: any) => {
        if (res?.status === 200) {
          Notification("success", "Role deleted");
          setDeleteTarget(null);
          refetch();
        } else {
          Notification("error", res?.message || "Failed to delete role");
          setDeleteTarget(null);
        }
      },
    });
  };

  const renderMenuChecklist = () => {
    // Menu khusus SUPERADMIN (Users, Role Management) hanya tampil saat
    // mengelola role SUPERADMIN — role lain tidak mungkin mengaksesnya.
    const isEditingSuperAdmin =
      formAction?.is_system && formAction?.name === "SUPERADMIN";
    const visibleParents = (parentMenus as MenuRow[]).filter(
      (m) => isEditingSuperAdmin || !m.is_superadmin_only,
    );

    return (
      <div className="mt-2 max-h-64 overflow-y-auto border border-gray-200 rounded-xl p-3 space-y-3 custom-scrollbar">
        {visibleParents.map((parent: MenuRow) => {
          const children = (menus as MenuRow[])
            .filter(
              (m) =>
                m.parent_code === parent.code &&
                (isEditingSuperAdmin || !m.is_superadmin_only),
            )
            .sort((a, b) => a.label.localeCompare(b.label));

          const isLeaf = children.length === 0;
          const checkedCount = children.filter((c) =>
            selectedMenuIds.has(c.id),
          ).length;
          // Leaf: checkbox = id parent. Parent: checkbox = SEMUA anak terpilih.
          const checked = isLeaf
            ? selectedMenuIds.has(parent.id)
            : checkedCount === children.length;
          const indeterminate =
            !isLeaf && checkedCount > 0 && checkedCount < children.length;
          const isRequired = !!(homeMenu && parent.id === homeMenu.id);

          return (
            <div key={parent.id} className="border border-gray-100 rounded-lg p-2.5">
              <label
                className={`flex items-center gap-2.5 cursor-pointer select-none ${
                  isLeaf ? "" : "font-medium"
                }`}
              >
                <input
                  type="checkbox"
                  checked={checked}
                  ref={(el) => {
                    if (el) el.indeterminate = indeterminate;
                  }}
                  onChange={() => {
                    // Home selalu wajib diakses — tidak bisa di-uncheck
                    if (isRequired) return;
                    if (isLeaf) {
                      toggleMenu(parent.id);
                    } else {
                      // toggle semua anak + id parent (parent aktif hanya
                      // bila seluruh anak terpilih)
                      const next = new Set(selectedMenuIds);
                      if (checkedCount === children.length) {
                        children.forEach((c) => next.delete(c.id));
                        next.delete(parent.id);
                      } else {
                        children.forEach((c) => next.add(c.id));
                        next.add(parent.id);
                      }
                      setSelectedMenuIds(next);
                    }
                  }}
                />
                <span className="text-sm text-gray-800">{parent.label}</span>
                {isRequired && (
                  <span className="text-[10px] bg-primary-50 text-primary-600 px-1.5 py-0.5 rounded-full">
                    required
                  </span>
                )}
              </label>
              {children.length > 0 && (
                <div className="ml-6 mt-2 space-y-2">
                  {children.map((child: MenuRow) => (
                    <label
                      key={child.id}
                      className="flex items-center gap-2.5 cursor-pointer select-none"
                    >
                      <input
                        type="checkbox"
                        checked={selectedMenuIds.has(child.id)}
                        onChange={() => toggleMenu(child.id, parent)}
                      />
                      <span className="text-sm text-gray-700">{child.label}</span>
                    </label>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>
    );
  };

  if (state.isLoading) {
    return <TableSkeleton rows={4} cols={4} />;
  }

  return (
    <div className="flex flex-col gap-5">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-gray-900">Role Management</h1>
          <p className="text-xs text-gray-600 mt-0.5">
            Kelola role & menu access untuk setiap pengguna CMS
          </p>
        </div>
        <button
          onClick={openAdd}
          className="flex items-center gap-1.5 px-3 py-1.5 text-sm bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
        >
          <Plus className="w-4 h-4" />
          Add Role
        </button>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-2xl p-6 border border-gray-200">
        <div className="flex items-center gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-600" />
            <input
              type="text"
              placeholder="Search role by name or description..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-4 py-1.5 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-gray-100 text-gray-900 placeholder:text-gray-600"
            />
          </div>
        </div>
      </div>

      {/* Roles Table */}
      {isLoading ? (
        <TableSkeleton rows={5} cols={5} />
      ) : (
        <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-100 border-b border-gray-300">
                <tr>
                  <th className="text-left py-3 px-4 text-xs font-medium text-gray-700">Role</th>
                  <th className="text-left py-3 px-4 text-xs font-medium text-gray-700">Description</th>
                  <th className="text-left py-3 px-4 text-xs font-medium text-gray-700">Users</th>
                  <th className="text-left py-3 px-4 text-xs font-medium text-gray-700">Menu Access</th>
                  <th className="text-left py-3 px-4 text-xs font-medium text-gray-700">Status</th>
                  <th className="text-right py-3 px-4 text-xs font-medium text-gray-700">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {filteredRoles.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="py-8 text-center text-gray-600">
                      {searchTerm ? "No roles found matching your search" : "No roles found"}
                    </td>
                  </tr>
                ) : (
                  filteredRoles.map((role) => (
                    <tr key={role._id || role.id} className="hover:bg-gray-100 transition-colors">
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-2.5">
                          <div
                            className={`w-8 h-8 rounded-full flex items-center justify-center ${
                              role.is_system ? "bg-primary-600" : "bg-indigo-500"
                            }`}
                          >
                            <Shield className="w-4 h-4 text-white" />
                          </div>
                          <div>
                            <p className="text-sm font-medium text-gray-800 capitalize">
                              {role.name.toLowerCase()}
                            </p>
                            {role.is_system && (
                              <span className="text-[10px] bg-primary-50 text-primary-600 px-1.5 py-0.5 rounded-full font-medium">
                                System
                              </span>
                            )}
                          </div>
                        </div>
                      </td>
                      <td className="py-3 px-4 text-xs text-gray-600 max-w-[220px] truncate">
                        {role.description || "-"}
                      </td>
                      <td className="py-3 px-4">
                        <span className="inline-flex items-center gap-1 text-xs text-gray-700">
                          <Users className="w-3.5 h-3.5 text-gray-500" />
                          {role.user_count}
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        <span className="inline-flex items-center gap-1 text-xs text-gray-700">
                          <CheckCircle2 className="w-3.5 h-3.5 text-green-500" />
                          {role.menu_ids.length} menu
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        {role.is_active ? (
                          <span className="inline-flex items-center gap-1 text-[11px] px-2 py-1 rounded-full bg-green-50 text-green-600 font-medium">
                            <CheckCircle2 className="w-3 h-3" />
                            Active
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 text-[11px] px-2 py-1 rounded-full bg-red-50 text-red-600 font-medium">
                            <XCircle className="w-3 h-3" />
                            Inactive
                          </span>
                        )}
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => openEdit(role)}
                            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                            title="Edit role"
                          >
                            <Pencil className="w-4 h-4 text-gray-600" />
                          </button>
                          <button
                            onClick={() => setDeleteTarget(role)}
                            disabled={role.is_system || role.user_count > 0}
                            className="p-2 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                            title={
                              role.is_system
                                ? "System role cannot be deleted"
                                : role.user_count > 0
                                  ? "Role is assigned to users"
                                  : "Delete role"
                            }
                          >
                            <Trash2 className="w-4 h-4 text-red-500" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Add/Edit Modal */}
      {show !== "NONE" && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-6 w-full max-w-lg">
            <h2 className="text-base font-bold text-gray-900 mb-4">
              {show === "ADD" ? "Add New Role" : `Edit Role: ${formAction?.name}`}
            </h2>
            <Form form={form} layout="vertical" requiredMark={false}>
              <InputForm
                type="text"
                name="name"
                label="Role Name"
                placeholder="e.g. CONTENT_MANAGER"
                required
                disabled={show === "UPDATE" && formAction?.is_system}
                form={formAction}
                setForm={(e: any) => setFormAction(e)}
              />
              <InputForm
                type="textarea"
                name="description"
                label="Description"
                placeholder="Short description of this role"
                form={formAction}
                setForm={(e: any) => setFormAction(e)}
              />

              <Form.Item
                label="Menu Access"
                required
                className="mb-1"
              >
                <p className="text-xs text-gray-500 mb-2">
                  Pilih menu yang boleh diakses role ini. Menu <b>Home</b> selalu aktif.
                </p>
                {menus.length === 0 ? (
                  <div className="animate-pulse bg-gray-100 h-20 rounded-xl" />
                ) : (
                  renderMenuChecklist()
                )}
              </Form.Item>

              <div className="flex gap-3 mt-5">
                <button
                  type="button"
                  onClick={() => setShow("NONE")}
                  className="flex-1 px-4 py-2 text-sm border border-gray-300 text-gray-600 rounded-lg hover:bg-gray-100 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleSave}
                  disabled={createPending || updatePending}
                  className="flex-1 px-4 py-2 text-sm bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors disabled:opacity-50"
                >
                  {createPending || updatePending
                    ? "Saving..."
                    : show === "ADD"
                      ? "Create Role"
                      : "Save Changes"}
                </button>
              </div>
            </Form>
          </div>
        </div>
      )}

      {/* Delete Confirmation */}
      {deleteTarget && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-6 w-full max-w-md text-center">
            <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-3">
              <Trash2 className="w-5 h-5 text-red-500" />
            </div>
            <h2 className="text-base font-bold text-gray-900 mb-1.5">Delete Role</h2>
            <p className="text-sm text-gray-600 mb-5">
              Are you sure you want to delete role "
              <span className="font-semibold capitalize">{deleteTarget.name.toLowerCase()}</span>
              "? This action cannot be undone.
            </p>
            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => setDeleteTarget(null)}
                className="flex-1 px-4 py-2 text-sm border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-100 transition-colors font-medium"
                disabled={deletePending}
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleDelete}
                disabled={deletePending}
                className="flex-1 px-4 py-2 text-sm bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors font-medium disabled:opacity-50"
              >
                {deletePending ? "Deleting..." : "Delete"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
