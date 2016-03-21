require_relative 'spec_helper'
require_relative '../upload_file'

RSpec.describe 'Upload file' do
  before do
    @sample = Samples::Storage::UploadFile.new
  end

  it "uploads file to bucket using resumable upload" do
    @sample.upload_file '/Users/chris/temp/test-large-video.mp4'
  end
end