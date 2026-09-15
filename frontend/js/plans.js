function getCurrentPlan() {

    return (
        localStorage.getItem("plan") ||
        "FREE"
    );
}
function savePlan(plan) {

    localStorage.setItem(
        "plan",
        plan
    );
}
function displayCurrentPlan() {

    const plan =
        getCurrentPlan();


    const currentPlan =
        document.getElementById(
            "currentPlan"
        );


    const description =
        document.getElementById(
            "currentPlanDescription"
        );


    if (currentPlan) {

        currentPlan.textContent =
            plan;
    }


    if (!description) {
        return;
    }


    if (plan === "PREMIUM") {

        description.textContent =
            "You have access to all Premium features.";

    } else if (plan === "PRO") {

        description.textContent =
            "You have access to all Premium and Pro features.";

    } else {

        description.textContent =
            "You are currently using the Free plan.";
    }
}
function hasFeature(feature) {

    const plan =
        getCurrentPlan();


    const premiumFeatures = [

        "ai-summary",

        "ai-objective",

        "ai-skills",

        "ai-improve",

        "grammar",

        "ats",

        "keywords",

        "skills-match",

        "formatting",

        "premium-templates",

        "unlimited-resumes",

        "unlimited-pdf",

        "remove-watermark"

    ];


    const proFeatures = [

        "advanced-ats",

        "multiple-resumes",

        "job-optimization",

        "ai-rewrite",

        "advanced-keywords",

        "job-specific-resume",

        "priority-ai",

        "priority-support"

    ];


    if (
        plan === "PREMIUM" ||
        plan === "PRO"
    ) {

        if (
            premiumFeatures.includes(feature)
        ) {

            return true;
        }
    }


    if (plan === "PRO") {

        if (
            proFeatures.includes(feature)
        ) {

            return true;
        }
    }


    return false;
}
function isPremium() {

    const plan =
        getCurrentPlan();

    return (
        plan === "PREMIUM" ||
        plan === "PRO"
    );
}
function isPro() {

    return (
        getCurrentPlan() === "PRO"
    );
}
function showUpgradeMessage(
    requiredPlan = "PREMIUM"
) {

    const price =
        requiredPlan === "PRO"
            ? "₹499/month"
            : "₹199/month";


    const result =
        confirm(
            `This is a ${requiredPlan} feature.\n\n` +
            `Upgrade for ${price}?\n\n` +
            `Click OK to open Plans.`
        );


    if (result) {

        window.location.href =
            "plans.html";
    }
}
function selectPlan(plan) {

    const currentPlan =
        getCurrentPlan();


    if (plan === currentPlan) {

        alert(
            `You are already using the ${plan} plan.`
        );

        return;
    }
    if (plan === "FREE") {

        const confirmFree =
            confirm(
                "Switch to Free plan?"
            );


        if (!confirmFree) {
            return;
        }


        savePlan("FREE");

        displayCurrentPlan();


        alert(
            "Free plan selected."
        );


        return;
    }
    if (plan === "PREMIUM") {

        const confirmPremium =
            confirm(
                "Upgrade to Premium for ₹199/month?"
            );


        if (!confirmPremium) {
            return;
        }


        /*
         * =================================================
         * PAYMENT INTEGRATION
         * =================================================
         *
         * Future backend flow:
         *
         * POST /api/payment/create-order
         *
         * Payment Gateway
         *
         * POST /api/payment/verify
         *
         * Backend updates:
         *
         * subscription = PREMIUM
         *
         * =================================================
         */


        savePlan(
            "PREMIUM"
        );


        displayCurrentPlan();


        alert(
            "Premium activated for frontend testing.\n\n" +
            "Payment gateway will be connected with the backend next."
        );


        return;
    }
    
    if (plan === "PRO") {

        const confirmPro =
            confirm(
                "Upgrade to Pro for ₹499/month?"
            );


        if (!confirmPro) {
            return;
        }


        savePlan(
            "PRO"
        );


        displayCurrentPlan();


        alert(
            "Pro activated for frontend testing.\n\n" +
            "Payment gateway will be connected with the backend next."
        );
    }
}
function logout() {

    localStorage.removeItem(
        "token"
    );

    localStorage.removeItem(
        "user"
    );

    localStorage.removeItem(
        "plan"
    );


    window.location.href =
        "login.html";
}

document.addEventListener(
    "DOMContentLoaded",
    function () {

        displayCurrentPlan();
    }
);