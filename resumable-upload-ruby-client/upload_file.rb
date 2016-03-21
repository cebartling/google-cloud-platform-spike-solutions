#!/usr/bin/env ruby


module Samples
  module Storage
    class UploadFile
      require 'gcloud'
      require 'dotenv'
      require 'faraday'

      def initialize
        Dotenv.load '.env'

        # Use httpclient to avoid broken pipe errors with large uploads
        # Faraday.default_adapter = :httpclient

        # Only add the following statement if using Faraday >= 0.9.2
        # Override gzip middleware with no-op for httpclient
        # Faraday::Response.register_middleware gzip: Faraday::Response::Middleware
      end

      def upload_file(filename)
        gcloud = Gcloud.new ENV['PROJECT_ID'], ENV['SERVICE_ACCOUNT_KEY']
        storage = gcloud.storage

        bucket = storage.bucket 'foobar-001'

        chunk_size = 256*1024   # 256KB chunk size
        bucket.create_file(filename, File.basename(filename), chunk_size: chunk_size)
      end
    end

    if __FILE__ == $PROGRAM_NAME
      filename = ARGV.shift
      UploadFile.new.upload_file filename
    end
  end
end


