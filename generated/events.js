"use strict";
/**
 * The events package provides event handling support.
 *
 * Brigade scripts are event-driven. Each brigade JS file declares one or more events
 * that it can handle. When the Brigade controller emits a matching event, the
 * appropriate handler is kicked off.
 */
Object.defineProperty(exports, "__esModule", { value: true });
const events_1 = require("events");
/**
 * BrigadeEvent describes an event.
 *
 * Brigade is an event-based system. The BrigadeEvent object describes such an
 * event.
 *
 * Every event has a `type` and a `provider`, where the type indicates what
 * sort of event it is (e.g. `push`) and the provider indicates what system
 * provided the event (`github`, `acr`).
 *
 * Most events also have a commit ID, which is associated with the underlying
 * VCS, and a `payload`, which contains the message received from the provider.
 *
 * For example, when a GitHub Push event happens, the BrigadeEvent will have:
 *
 * - type set to `push`
 * - provider set to `github`
 * - commit set to the Git commit ID (e.g. `c0ff3312345...`)
 * - payload set to a string that contains the JSON document received from
 *   GitHub.
 * - buildID set to the build ID.
 *
 * Note that the payload is considered "opaque": It is up to the script to parse
 * it.
 */
class BrigadeEvent {
}
exports.BrigadeEvent = BrigadeEvent;
/**
 * Revision describes a vcs revision.
 */
class Revision {
}
exports.Revision = Revision;
/**
 * A Cause is a wrapper around an event. It is used to indicate that this event
 * caused a condition to occur.
 *
 * Frequently this is used to capture a case where an event triggered an error.
 */
class Cause {
}
exports.Cause = Cause;
/**
 * Project represents a Brigade project.
 */
class Project {
}
exports.Project = Project;
/**
 * EventRegistry manages the registration and execution of events.
 */
class EventRegistry extends events_1.EventEmitter {
    /**
     * Create a new event registry.
     */
    constructor() {
        super();
        this.on("ping", (e, p) => {
            console.log("ping");
        });
    }
    has(name) {
        return this.listenerCount(name) > 0;
    }
    /**
     * fire triggers an event.
     * This uses BrigadeEvent.name to fire an event.
     */
    fire(e, proj) {
        this.emit(e.type, e, proj);
    }
}
exports.EventRegistry = EventRegistry;
