import { ListSchema } from "@wl-apps/schema-to-ui";
import { UserPlaylist } from "@wl-apps/types";

export const userPlaylistsListSchema: ListSchema<UserPlaylist> = {
  columns: {
    name: {
      label: "Name",
      field: "name",
      type: "text",
      sortable: true,
      width: "30%",
      format: {
        text: {
          truncate: 50
        }
      }
    },
    owner: {
      label: "Owner",
      field: "owner",
      type: "reference",
      sortable: true,
      format: {
        reference: {
          labelField: "display_name",
          fallback: "Unknown Owner"
        }
      }
    },
    public: {
      label: "Public",
      field: "public",
      type: "boolean",
      sortable: true,
      format: {
        boolean: {
          trueText: "Public",
          falseText: "Private"
        }
      }
    }
  },
  options: {
    pagination: {
      enabled: true,
      pageSize: 10,
      pageSizeOptions: [10, 25, 50]
    },
    selection: {
      enabled: true,
      type: "multi"
    },
    defaultSort: {
      field: "name",
      direction: "asc"
    }
  }
};