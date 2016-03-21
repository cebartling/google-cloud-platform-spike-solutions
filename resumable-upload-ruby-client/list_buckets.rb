#!/usr/bin/env ruby

module Samples
  module Storage
    class ListBuckets
      require "google/apis/storage_v1"

      # Alias the Google Cloud Storage module
      Storage = Google::Apis::StorageV1

      def list_buckets project_id
        # Create the storage service object, used to access the storage api.
        storage = Storage::StorageService.new
        # Have the service object use the application default credentials to
        # auth, which infers credentials from the environment.
        storage.authorization = Google::Auth.get_application_default(
          # Set the credentials to have a readonly scope to the storage service.
          Storage::AUTH_DEVSTORAGE_READ_ONLY
        )

        # Make the api call to list buckets owned by the default credentials.
        storage.list_buckets(project_id).items.each do |bucket|
          # Print out each bucket name.
          puts bucket.name
        end
      end
    end

    if __FILE__ == $PROGRAM_NAME
      project_id = ARGV.shift

      ListBuckets.new.list_buckets project_id
    end
  end
end