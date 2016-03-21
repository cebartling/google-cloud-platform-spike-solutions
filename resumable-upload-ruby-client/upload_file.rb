#!/usr/bin/env ruby


module Samples
  module Storage
    class UploadFile
      require 'gcloud'
      require 'dotenv'

      def initialize
        Dotenv.load '.env'
      end

      def upload_file(filename)
        gcloud = Gcloud.new ENV['PROJECT_ID'], ENV['SERVICE_ACCOUNT_KEY']
        storage = gcloud.storage
        buckets = storage.buckets
        buckets.each do |bucket|
          puts bucket.name
        end
      end
    end

    if __FILE__ == $PROGRAM_NAME
      filename = ARGV.shift
      UploadFile.new.upload_file filename
    end
  end
end


