#!/usr/bin/env ruby

module Samples
  module Storage
    class UploadFile
      require 'gcloud'

      def upload_file(filename)
        gcloud = Gcloud.new 'chunked-upload-spike', './chunked-upload-spike-a4353494761a.json'
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


