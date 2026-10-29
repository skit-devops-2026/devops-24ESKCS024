/* eslint-disable @typescript-eslint/no-explicit-any */
// Local development mock client for Supabase.
// Enables full offline functionality (Registration, Login, Complaints, Storage)
// when no live Supabase cloud project is configured.

const SEED_COMPLAINTS = [
  {
    id: "complaint-seed-1",
    student_id: "demo-student-1",
    title: "Ceiling fan not working in Room B-204",
    description: "The fan stopped spinning yesterday evening. Regulator seems fine.",
    category: "electrical",
    hostel_block: "Block B",
    room_number: "B-204",
    image_path: null,
    status: "in_progress",
    remarks: "Electrician assigned for inspection.",
    assigned_to: "Ramesh Kumar (Electrician)",
    created_at: new Date(Date.now() - 86400000 * 2).toISOString(),
    updated_at: new Date(Date.now() - 86400000).toISOString(),
  },
  {
    id: "complaint-seed-2",
    student_id: "demo-student-2",
    title: "Leaking bathroom faucet",
    description: "Water leaking continuously from the washbasin tap.",
    category: "plumbing",
    hostel_block: "Block A",
    room_number: "A-102",
    image_path: null,
    status: "pending",
    remarks: null,
    assigned_to: null,
    created_at: new Date(Date.now() - 86400000).toISOString(),
    updated_at: new Date(Date.now() - 86400000).toISOString(),
  },
  {
    id: "complaint-seed-3",
    student_id: "demo-student-1",
    title: "Wi-Fi access point unreachable",
    description: "No connection on the 2nd floor corridor access point.",
    category: "internet",
    hostel_block: "Block B",
    room_number: "B-204",
    image_path: null,
    status: "resolved",
    remarks: "Router reset and switch port reconfigured.",
    assigned_to: "IT Support Team",
    created_at: new Date(Date.now() - 86400000 * 4).toISOString(),
    updated_at: new Date(Date.now() - 86400000 * 2).toISOString(),
  },
];

function getStorage<T>(key: string, fallback: T): T {
  if (typeof window === "undefined" || !window.localStorage) return fallback;
  try {
    const raw = window.localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch {
    return fallback;
  }
}

function setStorage<T>(key: string, value: T): void {
  if (typeof window === "undefined" || !window.localStorage) return;
  try {
    window.localStorage.setItem(key, JSON.stringify(value));
  } catch {
    // ignore quota errors
  }
}

const authListeners = new Set<(event: string, session: any) => void>();

function notifyAuth(event: string, session: any) {
  authListeners.forEach((cb) => {
    try {
      cb(event, session);
    } catch (e) {
      console.error("[Mock Supabase] Auth listener error:", e);
    }
  });
}

export function createMockSupabaseClient() {
  // Initialize seed complaints if none exist
  if (typeof window !== "undefined" && window.localStorage) {
    const existing = window.localStorage.getItem("mock_table_complaints");
    if (!existing) {
      setStorage("mock_table_complaints", SEED_COMPLAINTS);
    }
  }

  return {
    auth: {
      async getSession() {
        const session = getStorage<any>("mock_session", null);
        return { data: { session }, error: null };
      },

      async getUser() {
        const session = getStorage<any>("mock_session", null);
        return { data: { user: session?.user ?? null }, error: null };
      },

      onAuthStateChange(callback: (event: string, session: any) => void) {
        authListeners.add(callback);
        const session = getStorage<any>("mock_session", null);
        if (session) {
          setTimeout(() => callback("INITIAL_SESSION", session), 0);
        }
        return {
          data: {
            subscription: {
              unsubscribe: () => authListeners.delete(callback),
            },
          },
        };
      },

      async signUp({ email, password, options }: any) {
        const users = getStorage<any[]>("mock_users", []);
        let user = users.find((u) => u.email.toLowerCase() === email.toLowerCase());
        if (!user) {
          user = {
            id: "user-" + Math.random().toString(36).slice(2, 10),
            email: email.trim(),
            created_at: new Date().toISOString(),
            user_metadata: options?.data || {},
          };
          users.push(user);
          setStorage("mock_users", users);
        }

        const profiles = getStorage<any[]>("mock_table_profiles", []);
        const pIdx = profiles.findIndex((p) => p.id === user.id);
        const profile = {
          id: user.id,
          name: options?.data?.name?.trim() || email.split("@")[0],
          email: email.trim(),
          room_number: options?.data?.room_number?.trim() || null,
          hostel_block: options?.data?.hostel_block || null,
          phone: options?.data?.phone?.trim() || null,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        };
        if (pIdx >= 0) {
          profiles[pIdx] = { ...profiles[pIdx], ...profile };
        } else {
          profiles.push(profile);
        }
        setStorage("mock_table_profiles", profiles);

        const roles = getStorage<any[]>("mock_table_user_roles", []);
        const rIdx = roles.findIndex((r) => r.user_id === user.id);
        const isAdmin = email.toLowerCase().includes("admin");
        if (rIdx >= 0) {
          roles[rIdx].role = isAdmin ? "admin" : "student";
        } else {
          roles.push({
            id: "role-" + Math.random().toString(36).slice(2, 10),
            user_id: user.id,
            role: isAdmin ? "admin" : "student",
          });
        }
        setStorage("mock_table_user_roles", roles);

        const session = {
          access_token: "mock-token-" + user.id + "-" + Date.now(),
          token_type: "bearer",
          user,
        };
        setStorage("mock_session", session);
        notifyAuth("SIGNED_IN", session);

        return { data: { user, session }, error: null };
      },

      async signInWithPassword({ email }: any) {
        const users = getStorage<any[]>("mock_users", []);
        let user = users.find((u) => u.email.toLowerCase() === email.toLowerCase());
        if (!user) {
          user = {
            id: "user-" + Math.random().toString(36).slice(2, 10),
            email: email.trim(),
            created_at: new Date().toISOString(),
            user_metadata: {},
          };
          users.push(user);
          setStorage("mock_users", users);

          const profiles = getStorage<any[]>("mock_table_profiles", []);
          profiles.push({
            id: user.id,
            name: email.split("@")[0],
            email: email.trim(),
            room_number: "A-101",
            hostel_block: "Block A",
            phone: null,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
          });
          setStorage("mock_table_profiles", profiles);

          const roles = getStorage<any[]>("mock_table_user_roles", []);
          roles.push({
            id: "role-" + Math.random().toString(36).slice(2, 10),
            user_id: user.id,
            role: email.toLowerCase().includes("admin") ? "admin" : "student",
          });
          setStorage("mock_table_user_roles", roles);
        }

        const session = {
          access_token: "mock-token-" + user.id + "-" + Date.now(),
          token_type: "bearer",
          user,
        };
        setStorage("mock_session", session);
        notifyAuth("SIGNED_IN", session);

        return { data: { user, session }, error: null };
      },

      async signOut() {
        setStorage("mock_session", null);
        notifyAuth("SIGNED_OUT", null);
        return { error: null };
      },
    },

    from(table: string) {
      const filters: ((row: any) => boolean)[] = [];
      let sortField: string | null = null;
      let sortAsc = true;
      let isSingle = false;
      let isMaybeSingle = false;
      let insertPayload: any = null;
      let updatePayload: any = null;
      let isDelete = false;

      const builder: any = {
        select() {
          return builder;
        },
        insert(data: any) {
          insertPayload = data;
          return builder;
        },
        update(data: any) {
          updatePayload = data;
          return builder;
        },
        delete() {
          isDelete = true;
          return builder;
        },
        eq(column: string, value: any) {
          filters.push((row: any) => row[column] === value);
          return builder;
        },
        order(field: string, opts?: { ascending?: boolean }) {
          sortField = field;
          sortAsc = opts?.ascending ?? true;
          return builder;
        },
        single() {
          isSingle = true;
          return builder;
        },
        maybeSingle() {
          isMaybeSingle = true;
          return builder;
        },
        then(resolve: any, reject: any) {
          let rows = getStorage<any[]>(`mock_table_${table}`, []);

          if (insertPayload) {
            const items = Array.isArray(insertPayload) ? insertPayload : [insertPayload];
            const newItems = items.map((item) => ({
              id: item.id || "complaint-" + Math.random().toString(36).slice(2, 10),
              created_at: item.created_at || new Date().toISOString(),
              updated_at: new Date().toISOString(),
              status: item.status || "pending",
              ...item,
            }));
            rows = [...newItems, ...rows];
            setStorage(`mock_table_${table}`, rows);
            return Promise.resolve({ data: newItems, error: null }).then(resolve, reject);
          }

          if (updatePayload) {
            rows = rows.map((row) => {
              if (filters.every((f) => f(row))) {
                return { ...row, ...updatePayload, updated_at: new Date().toISOString() };
              }
              return row;
            });
            setStorage(`mock_table_${table}`, rows);
            return Promise.resolve({ data: updatePayload, error: null }).then(resolve, reject);
          }

          if (isDelete) {
            rows = rows.filter((row) => !filters.every((f) => f(row)));
            setStorage(`mock_table_${table}`, rows);
            return Promise.resolve({ data: null, error: null }).then(resolve, reject);
          }

          // Apply RLS emulation for complaints: students only see their own rows
          const session = getStorage<any>("mock_session", null);
          const currentUserId = session?.user?.id;
          const userRoles = getStorage<any[]>("mock_table_user_roles", []);
          const isAdmin = currentUserId
            ? userRoles.some((r) => r.user_id === currentUserId && r.role === "admin")
            : false;

          let result = rows;
          if (table === "complaints" && !isAdmin && currentUserId) {
            // Student only sees their own complaints
            result = result.filter((c) => c.student_id === currentUserId);
          }

          if (filters.length > 0) {
            result = result.filter((row) => filters.every((f) => f(row)));
          }

          if (sortField) {
            result = [...result].sort((a, b) => {
              const valA = a[sortField!];
              const valB = b[sortField!];
              if (valA < valB) return sortAsc ? -1 : 1;
              if (valA > valB) return sortAsc ? 1 : -1;
              return 0;
            });
          }

          if (isSingle) {
            return Promise.resolve({
              data: result[0] || null,
              error: result[0] ? null : new Error("Row not found"),
            }).then(resolve, reject);
          }

          if (isMaybeSingle) {
            return Promise.resolve({
              data: result[0] || null,
              error: null,
            }).then(resolve, reject);
          }

          return Promise.resolve({ data: result, error: null }).then(resolve, reject);
        },
      };

      return builder;
    },

    storage: {
      from(bucket: string) {
        return {
          async upload(path: string, file: Blob | File) {
            try {
              if (typeof window !== "undefined" && window.FileReader) {
                const reader = new FileReader();
                const dataUrl = await new Promise<string>((res, rej) => {
                  reader.onload = () => res(reader.result as string);
                  reader.onerror = rej;
                  reader.readAsDataURL(file);
                });
                try {
                  window.localStorage.setItem(`mock_storage_${bucket}_${path}`, dataUrl);
                } catch {
                  // localStorage quota full fallback
                }
              }
              return { data: { path }, error: null };
            } catch (err) {
              return { data: null, error: err };
            }
          },

          async createSignedUrl(path: string) {
            let url: string | null = null;
            if (typeof window !== "undefined" && window.localStorage) {
              url = window.localStorage.getItem(`mock_storage_${bucket}_${path}`);
            }
            if (!url) {
              url =
                "https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&w=600&q=80";
            }
            return { data: { signedUrl: url }, error: null };
          },

          getPublicUrl(path: string) {
            let url: string | null = null;
            if (typeof window !== "undefined" && window.localStorage) {
              url = window.localStorage.getItem(`mock_storage_${bucket}_${path}`);
            }
            if (!url) {
              url =
                "https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&w=600&q=80";
            }
            return { data: { publicUrl: url } };
          },
        };
      },
    },
  };
}
