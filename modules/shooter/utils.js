define(["dojo/_base/array"], function(arrayUtil){
    var time_offset = 0;
    var time_results = [];

    function std_deviation(times){
        var mean = 0;
        for(var i =0, len = times.length; i<len; ++i){
            mean += times[i].latency;
        }
        mean /= times.length;
        var variance = 0;
        for(var i =0, len = times.length; i<len; ++i){
            variance += Math.pow(times[i].latency,2);
        }
        variance /= times.length;
        variance -= Math.pow(mean, 2);

        return Math.sqrt(variance);
    }
    function choose_time_offset(){
        time_results.sort(function(a,b){
            return a.latency < b.latency;
        });
        var median = time_results[Math.floor(time_results.length/2)];

        var deviation = std_deviation(time_results);
       
        var passing = arrayUtil.filter(time_results, function(result){
            return Math.abs(result.latency - median.latency) < (deviation +0.1);
        });

        var mean_latency = 0;
        var mean_offset = 0;
        for(var i=0, len = passing.length; i<len; ++i){
            mean_latency += passing[i].latency;
            mean_offset += passing[i].offset;

        }
        mean_latency /= passing.length;
        mean_offset /= passing.length;

        time_offset = Math.round(mean_offset + mean_latency);
    }
    return {
        time: function(){
            return new Date().getTime() + time_offset;
        },
        new_time_result: function(data){
           var latency = (new Date().getTime() - data.c_time) / 2;
           var offset = data.s_time - new Date().getTime();
           time_results.push({latency: latency, offset: offset});
           choose_time_offset();
        },
        overlap: function(a,b){
            return (a.x2 > b.x1) && (a.x1 < b.x2) && (a.y2 > b.y1) && (a.y1 < b.y2);
        }
    }
});
