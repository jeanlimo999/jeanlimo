(function (w) {
  const cfg = () => Object.assign({
    company: "Jean Limo",
    ownerName: "Cash",
    ownerPhone: "2819170085",
    supabaseUrl: "",
    supabaseAnonKey: ""
  }, w.JL_CONFIG || {}, {
    supabaseUrl: localStorage.getItem("jl_supabase_url") || (w.JL_CONFIG && w.JL_CONFIG.supabaseUrl) || "",
    supabaseAnonKey: localStorage.getItem("jl_supabase_key") || (w.JL_CONFIG && w.JL_CONFIG.supabaseAnonKey) || ""
  });

  const DEMO_DRIVERS = [
    { id: "d_cash", name: "Cash", phone: "2819170085", pin: "1111", vehicle: "sedan", last_lat: 29.7604, last_lng: -95.3698 },
    { id: "d_jeannie", name: "Jeannie", phone: "2819170929", pin: "2222", vehicle: "sedan", last_lat: 29.6198, last_lng: -95.6349 }
  ];

  function digits(p) {
    const d = String(p || "").replace(/\D/g, "");
    return d.length === 10 ? "1" + d : d;
  }
  function prettyPhone(p) {
    const d = String(p || "").replace(/\D/g, "");
    const x = d.length === 11 && d[0] === "1" ? d.slice(1) : d;
    return x.length === 10 ? `(${x.slice(0, 3)}) ${x.slice(3, 6)}-${x.slice(6)}` : (p || "");
  }
  function firstName(n) { return String(n || "there").trim().split(/\s+/)[0]; }
  function shortAddr(a) { return String(a || "").split(",")[0]; }
  function esc(s) {
    return String(s || "").replace(/[&<>"']/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", "\"": "&quot;", "'": "&#39;" }[c]));
  }

  function smsUrl(phone, body) {
    const num = digits(phone);
    const q = encodeURIComponent(body);
    const ios = /iPhone|iPad|Mac/.test(navigator.userAgent);
    if (!num) return ios ? `sms:&body=${q}` : `sms:?body=${q}`;
    return ios ? `sms:+${num}&body=${q}` : `sms:+${num}?body=${q}`;
  }

  function messages(job, driver) {
    const guest = firstName(job.guestName);
    const dname = driver.name;
    const pu = job.pickup ? " (" + shortAddr(job.pickup) + ")" : "";
    const dphone = driver.phone ? " My number is " + prettyPhone(driver.phone) + "." : "";
    return {
      on_the_way: `Hi ${guest}, this is ${dname} with Jean Limo. I’m on the way to you now${pu}.${dphone}`,
      on_location: `Hi ${guest}, this is ${dname} with Jean Limo. I’m on location and ready for you${pu}.${driver.phone ? " Call or text " + prettyPhone(driver.phone) + " if you don’t see me." : ""}`,
      dropped_off_guest: `Hi ${guest}, you’ve been dropped off. Thank you — ${dname}, Jean Limo.`,
      dropped_off_owner: `DONE: ${job.guestName} dropped off by ${dname}. ${job.conf || ""} ${job.pickup ? "from " + shortAddr(job.pickup) : ""} ${job.dropoff ? "to " + shortAddr(job.dropoff) : ""}`.replace(/\s+/g, " ").trim()
    };
  }

  let client = null;
  function sb() {
    const c = cfg();
    if (!c.supabaseUrl || !c.supabaseAnonKey || !w.supabase) return null;
    if (!client) client = w.supabase.createClient(c.supabaseUrl, c.supabaseAnonKey);
    return client;
  }

  function saveLocal(key, val) { localStorage.setItem(key, JSON.stringify(val)); }
  function loadLocal(key, fallback) {
    try { return JSON.parse(localStorage.getItem(key)) ?? fallback; } catch { return fallback; }
  }

  async function listDrivers() {
    const db = sb();
    if (db) {
      const { data, error } = await db.from("drivers").select("*").eq("active", true).order("name");
      if (!error && data) return data;
    }
    return loadLocal("jl_drivers", DEMO_DRIVERS);
  }

  async function listJobs() {
    const db = sb();
    if (db) {
      const { data, error } = await db
        .from("bookings")
        .select("*, clients(full_name, phone, email)")
        .not("status", "eq", "cancelled")
        .order("ride_date", { ascending: true });
      if (!error && data) {
        return data.flatMap(row => rowsToJobs(row));
      }
    }
    return loadLocal("jl_jobs", demoJobs());
  }

  function rowsToJobs(row) {
    const guest = row.clients || {};
    const base = {
      bookingId: row.id,
      source: "Jean Limo",
      guestName: guest.full_name || "Guest",
      guestPhone: guest.phone || "",
      guestEmail: guest.email || "",
      vehicle: row.vehicle,
      assignedDriverId: row.assigned_driver_id || "",
      tripStatus: row.trip_status || row.status || "confirmed",
      last_lat: row.last_lat, last_lng: row.last_lng
    };
    const jobs = [{
      ...base,
      id: row.confirmation,
      conf: row.confirmation,
      when: [row.ride_date, row.ride_time].filter(Boolean).join(" "),
      pickup: row.pickup, dropoff: row.dropoff,
      notes: row.flight_number ? "Flight " + row.flight_number : (row.passenger_notes || ""),
      live_leg: "outbound"
    }];
    if (row.return_date || row.return_pickup) {
      jobs.push({
        ...base,
        id: row.confirmation + "-R",
        conf: row.confirmation + " return",
        when: [row.return_date, row.return_time].filter(Boolean).join(" "),
        pickup: row.return_pickup || row.dropoff,
        dropoff: row.return_dropoff || row.pickup,
        notes: row.return_flight_number ? "Return · " + row.return_flight_number : "Return",
        live_leg: "return"
      });
    }
    return jobs;
  }

  function demoJobs() {
    return [
      { id: "JL-260921-XGTN", bookingId: "local-1", conf: "JL-260921-XGTN", source: "Jean Limo", guestName: "Tien Lam", guestPhone: "2819170085", when: "2026-09-24 22:00", pickup: "11002 Myrtle Dr, Sugar Land, TX", dropoff: "12888 S Texas 6, Sugar Land, TX", vehicle: "sedan", notes: "", assignedDriverId: "", tripStatus: "confirmed", live_leg: "outbound" },
      { id: "JL-260921-751Q", bookingId: "local-2", conf: "JL-260921-751Q", source: "Jean Limo", guestName: "Cash Lam", guestPhone: "2819170085", when: "2026-10-26 11:00", pickup: "254 1st St E, Humble, TX", dropoff: "2800 N Terminal Rd, Houston, TX (IAH)", vehicle: "sedan", notes: "Outbound", assignedDriverId: "", tripStatus: "confirmed", live_leg: "outbound" }
    ];
  }

  async function addDriver({ name, phone, pin, vehicle }) {
    const row = {
      name: String(name || "").trim(),
      phone: String(phone || "").replace(/\D/g, ""),
      pin: String(pin || "").trim(),
      vehicle: String(vehicle || "sedan").trim() || "sedan",
      active: true
    };
    if (!row.name) throw new Error("Name required");
    const db = sb();
    if (db) {
      const { data, error } = await db.from("drivers").insert(row).select("*").single();
      if (error) throw error;
      return data;
    }
    const list = loadLocal("jl_drivers", DEMO_DRIVERS);
    const local = { ...row, id: "d_" + Date.now() };
    list.push(local);
    saveLocal("jl_drivers", list);
    return local;
  }

  async function assignDriver(job, driverId) {
    const db = sb();
    if (db && job.bookingId && !String(job.bookingId).startsWith("local")) {
      await db.from("bookings").update({
        assigned_driver_id: driverId || null,
        trip_status: driverId ? "assigned" : "confirmed",
        updated_at: new Date().toISOString()
      }).eq("id", job.bookingId);
    }
    const jobs = loadLocal("jl_jobs", demoJobs());
    const i = jobs.findIndex(j => j.id === job.id);
    if (i >= 0) {
      jobs[i].assignedDriverId = driverId;
      jobs[i].tripStatus = driverId ? "assigned" : "confirmed";
      saveLocal("jl_jobs", jobs);
    }
  }

  async function setTripStatus(job, status) {
    const db = sb();
    if (db && job.bookingId && !String(job.bookingId).startsWith("local")) {
      await db.from("bookings").update({
        trip_status: status,
        live_leg: job.live_leg || "outbound",
        updated_at: new Date().toISOString()
      }).eq("id", job.bookingId);
    }
    const jobs = loadLocal("jl_jobs", demoJobs());
    const i = jobs.findIndex(j => j.id === job.id);
    if (i >= 0) { jobs[i].tripStatus = status; saveLocal("jl_jobs", jobs); }
  }

  async function pingGps(driver, job, lat, lng) {
    const db = sb();
    const now = new Date().toISOString();
    if (db) {
      await db.from("drivers").update({ last_lat: lat, last_lng: lng, last_gps_at: now }).eq("id", driver.id);
      if (job && job.bookingId && !String(job.bookingId).startsWith("local")) {
        await db.from("bookings").update({ last_lat: lat, last_lng: lng, last_gps_at: now }).eq("id", job.bookingId);
        await db.from("gps_pings").insert({ driver_id: driver.id, booking_id: job.bookingId, lat, lng });
      }
    }
    const drivers = loadLocal("jl_drivers", DEMO_DRIVERS);
    const d = drivers.find(x => x.id === driver.id);
    if (d) { d.last_lat = lat; d.last_lng = lng; saveLocal("jl_drivers", drivers); }
  }

  w.JL = { cfg, digits, prettyPhone, firstName, shortAddr, esc, smsUrl, messages, sb, listDrivers, listJobs, addDriver, assignDriver, setTripStatus, pingGps, DEMO_DRIVERS, saveLocal, loadLocal };
})(window);
