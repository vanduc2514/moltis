#include <stdio.h>

#include "moltis_bridge.h"

int main(void) {
    char *version_json = moltis_version();
    if (version_json == NULL) {
        fprintf(stderr, "moltis_version returned NULL\n");
        return 1;
    }

    printf("version payload: %s\n", version_json);
    moltis_free_string(version_json);
    return 0;
}
