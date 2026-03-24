package com.icure.docs.helpers.howto

import com.icure.cardinal.sdk.CardinalSdk

object DefineUserRolesHelper {
    private var allRoles: Any? = null
    private var userId: String? = null

    val preTest: Map<String, suspend (sdk: CardinalSdk) -> Map<String, Any?>> = mapOf(
        "define-user-roles block 2 (AABM)" to { sdk ->
            if (allRoles == null) {
                allRoles = sdk.role.getAllRoles()
            }
            val currentUser = sdk.user.getCurrentUser()
            userId = currentUser.id
            mapOf("userId" to userId, "allRoles" to allRoles)
        },
        "define-user-roles block 3 (AABN)" to { sdk ->
            if (userId == null) {
                val currentUser = sdk.user.getCurrentUser()
                userId = currentUser.id
            }
            mapOf("userId" to userId)
        },
    )
    val postTest: Map<String, suspend (sdk: CardinalSdk, extracted: Map<String, Any?>) -> Unit> = mapOf(
        "define-user-roles block 1 (AABL)" to { _, extracted ->
            allRoles = extracted["allRoles"]
        },
    )
}
