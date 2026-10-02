/* ==========================================================================
   ENTERPRISE AUTHENTICATION MANAGER
   Handles domain restrictions, role verification, and secure routing.
   Requires firebase-config.js to be loaded first.
   ========================================================================== */

window.enforceClearance = function(requiredRole, redirectUrl) {
    
    // Ensure global auth object is available
    if (!window.sbrAuth || !window.sbrDb) {
        console.error("Auth Manager Error: Firebase not initialized globally.");
        window.location.href = redirectUrl;
        return;
    }

    // Listen to Firebase Auth State
    window.sbrAuth.onAuthStateChanged((user) => {
        if (!user) {
            console.warn("Security Event: Unauthenticated access attempt. Redirecting.");
            window.location.href = redirectUrl;
            return;
        }

        // Strict Domain Enforcement
        if (!user.email || !user.email.endsWith('@sbr.local')) {
            console.warn("Security Event: Invalid domain credential. Purging session.");
            window.sbrAuth.signOut().then(() => {
                window.location.href = redirectUrl;
            });
            return;
        }

        // Role-Based Access Control (RBAC)
        window.sbrDb.ref('users/' + user.uid).once('value').then((snapshot) => {
            if (snapshot.exists() && snapshot.val().role === requiredRole) {
                
                // Authorized: Extract Operator/Auditor ID
                const parsedId = user.email.split('@')[0].toUpperCase();
                
                // Dynamically update UI elements if they exist on the page
                const opIdElement = document.getElementById('hdr-operator-id');
                const audIdElement = document.getElementById('auth-auditor-id');
                const signerIdElement = document.getElementById('signer-id');
                
                if (opIdElement) opIdElement.innerText = parsedId;
                if (audIdElement) audIdElement.innerText = parsedId;
                if (signerIdElement) signerIdElement.innerText = parsedId;
                
                console.info(`Security Event: ${requiredRole.toUpperCase()} session established for ${parsedId}`);
                
            } else {
                // Unauthorized Role
                console.error(`Security Event: User lacks ${requiredRole} privileges. Terminating.`);
                window.sbrAuth.signOut().then(() => {
                    window.location.href = redirectUrl;
                });
            }
        }).catch((error) => {
            console.error("Database Validation Failure:", error);
            window.location.href = redirectUrl;
        });
    });
};
