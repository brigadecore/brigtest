"use strict";
/**
 * Package job provides support for jobs.
 *
 * A Job idescribes a particular unit of a build. A Job returns a Result.
 * A JobRunner is an implementation of the runtime logic for a Job.
 */
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * The default shell for the job.
 */
const defaultShell = "/bin/sh";
/**
 * defaultTimeout is the default timeout for a job (15 minutes)
 */
const defaultTimeout = 1000 * 60 * 15;
/**
 * The default image if `Job.image` is not set
 */
const brigadeImage = "debian:jessie-slim";
exports.brigadeCachePath = "/mnt/brigade/cache";
exports.brigadeStoragePath = "/mnt/brigade/share";
exports.dockerSocketMountPath = "/var/run/docker.sock";
exports.dockerSocketMountName = "docker-socket";
/**
 * Cache controls the job's cache.
 *
 * A cache is a small storage space that is shared between different instances
 * if the same job.
 *
 * Cache is just a plain filesystem, and as such comes with no guarantees about
 * consistency, etc. It should be treated as volatile.
 */
class JobCache {
    constructor() {
        /**
         * If enabled=true, a storage cache will be attached.
         */
        this.enabled = false;
        /**
         * size is the amount of storage space assigned to the cache. The default is
         * 5Mi.
         * For sizing information, see https://github.com/kubernetes/community/blob/master/contributors/design-proposals/resources.md
         */
        this.size = "5Mi";
        // future-proof Cache.path. For now we will hard-code it, but make it so that
        // we can modify in the future.
        this._path = exports.brigadeCachePath;
    }
    get path() {
        return this._path;
    }
}
exports.JobCache = JobCache;
/**
 * JobStorage configures build-wide storage preferences for this job.
 *
 * Changes to this object only impact the job, not the entire build.
 */
class JobStorage {
    constructor() {
        this.enabled = false;
        this._path = exports.brigadeStoragePath;
    }
    get path() {
        return this._path;
    }
}
exports.JobStorage = JobStorage;
/**
 * JobHost expresses expectations about the host a job will run on.
 */
class JobHost {
    constructor() {
        this.nodeSelector = new Map();
    }
}
exports.JobHost = JobHost;
/**
 * JobDockerMount enables or disables mounting the host's docker socket for a job.
 */
class JobDockerMount {
    constructor() {
        /**
         * enabled configues whether or not the job will mount the host's docker socket.
         */
        this.enabled = false;
    }
}
exports.JobDockerMount = JobDockerMount;
/**
 * JObResourceRequest represents request of the resources
 */
class JobResourceRequest {
}
exports.JobResourceRequest = JobResourceRequest;
/**
 * Job represents a single job, which is composed of several closely related sequential tasks.
 * Jobs must have names. Every job also has an associated image, which references
 * the Docker container to be run.
 * */
class Job {
    /** Create a new Job
     * name is the name of the job.
     * image is the container image to use
     * tasks is a list of commands to run.
     */
    constructor(name, image, tasks, imageForcePull) {
        /** shell that will be used by default in this job*/
        this.shell = defaultShell;
        /** image is the container image to be run*/
        this.image = brigadeImage;
        /** imageForcePull defines the container image pull policy: Always if true or IfNotPresent if false */
        this.imageForcePull = false;
        /** Path to mount as the base path for executable code in the container.*/
        this.mountPath = "/src";
        /** Set the max time to wait for this job to complete.*/
        this.timeout = defaultTimeout;
        /** Fetch the source repo. Default: true*/
        this.useSource = true;
        /** If true, the job will be run in privileged mode.
         * This is necessary for Docker engines running inside the Job, for example.
         */
        this.privileged = false;
        if (!jobNameIsValid(name)) {
            throw new Error("job name must be letters, numbers, and '-', and must not start or end with '-'");
        }
        this.name = name;
        this.image = image;
        this.imageForcePull = imageForcePull;
        this.tasks = tasks || [];
        this.env = {};
        this.cache = new JobCache();
        this.storage = new JobStorage();
        this.docker = new JobDockerMount();
        this.host = new JobHost();
        this.resourceRequests = new JobResourceRequest();
    }
    /** podName is the generated name of the pod.*/
    get podName() {
        return this._podName;
    }
}
exports.Job = Job;
/**
 * jobNameIsValid checks the validity of a job's name.
 */
function jobNameIsValid(name) {
    return /^(([a-z0-9][-a-z0-9.]*)?[a-z0-9])+$/.test(name);
}
exports.jobNameIsValid = jobNameIsValid;
