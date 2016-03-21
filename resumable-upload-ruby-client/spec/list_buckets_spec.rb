require_relative 'spec_helper'
require_relative '../list_buckets'

RSpec.describe "List buckets sample" do
  before do
    @sample = Samples::Storage::ListBuckets.new
  end

  it "lists buckets in provided project" do
    expect { @sample.list_buckets PROJECT_ID }.to(
      output(/#{BUCKET_NAME}/).to_stdout)
  end
end