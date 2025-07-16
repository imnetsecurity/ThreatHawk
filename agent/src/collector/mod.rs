// src/collector/mod.rs

use crossbeam_channel::Sender;

// This module now only contains the Linux implementation.
mod linux;

pub fn collect_events(tx: Sender<String>) {
    linux::collect_events_os(tx);
}
